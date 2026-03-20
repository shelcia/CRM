import { useEffect, useState } from "react";
import { Plus, TrendingUp, DollarSign, Target, Search, X } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/custom/StatCard";
import { cn } from "@/lib/utils";
import { AssignedToSelect } from "@/components/common";
import { apiDeals } from "@/services/models/dealsModel";
import PageHeader from "@/components/custom/PageHeader";
import AddDealDialog from "./components/AddDealDialog";
import DealCard from "./components/DealCard";
import { STAGES } from "./constants";
import { getFmtCurrencyVal } from "@/utils";
import { IDeal } from "./types";
import { AddPrimaryButton, KanbanSkeleton } from "@/components/custom";

const Pipeline = () => {
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAssignedTo, setFilterAssignedTo] = useState("all");

  useEffect(() => {
    const controller = new AbortController();
    apiDeals.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setDeals(res);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const filteredDeals = deals.filter((d) => {
    if (
      search &&
      !d.title.toLowerCase().includes(search.toLowerCase()) &&
      !d.contactName?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterAssignedTo !== "all" && d.assignedTo !== filterAssignedTo)
      return false;
    return true;
  });

  const dealsByStage = (stage: string) =>
    filteredDeals.filter((d) => d.stage === stage);

  const totalValue = deals
    .filter((d) => d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter((d) => d.stage === "won");
  const closedDeals = deals.filter(
    (d) => d.stage === "won" || d.stage === "lost",
  );
  const winRate =
    closedDeals.length > 0
      ? Math.round((wonDeals.length / closedDeals.length) * 100)
      : 0;

  const onDragEnd = (result: any) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const deal = deals.find((d) => d._id === draggableId);
    if (!deal || deal.stage === destination.droppableId) return;
    const newStage = destination.droppableId;
    setDeals((prev) =>
      prev.map((d) => (d._id === draggableId ? { ...d, stage: newStage } : d)),
    );
    apiDeals.putById!(
      draggableId,
      { ...deal, stage: newStage },
      new AbortController().signal,
      "",
      true,
    ).then((res) => {
      if (!res?._id) {
        setDeals((prev) =>
          prev.map((d) =>
            d._id === draggableId ? { ...d, stage: deal.stage } : d,
          ),
        );
        toast.error("Failed to move deal");
      }
    });
  };

  const handleUpdate = (updated: IDeal) =>
    setDeals((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));

  const handleDelete = (id: string) => {
    apiDeals.remove!(id, "", true).then((res) => {
      if (res?.message === "Deal deleted") {
        setDeals((prev) => prev.filter((d) => d._id !== id));
        toast.success("Deal deleted");
      } else {
        toast.error("Failed to delete deal");
      }
    });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Pipeline"
        description="Track deals across every stage"
        actions={
          <AddDealDialog
            onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
            trigger={<AddPrimaryButton text="New Deal" onClick={() => {}} />}
          />
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Pipeline Value"
          value={getFmtCurrencyVal(totalValue, "USD")}
          icon={DollarSign}
        />
        <StatCard label="Total Deals" value={deals.length} icon={Target} />
        <StatCard label="Win Rate" value={`${winRate}%`} icon={TrendingUp} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <AssignedToSelect
          allOption="All assignees"
          value={filterAssignedTo}
          onChange={setFilterAssignedTo}
          triggerClassName="h-8 text-sm w-40"
        />
        {(search || filterAssignedTo !== "all") && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => {
              setSearch("");
              setFilterAssignedTo("all");
            }}
          >
            <X className="size-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <KanbanSkeleton columns={STAGES.length} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 items-start">
            {STAGES.map((stage) => {
              const stageDeals = dealsByStage(stage.key);
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={stage.key} className="flex-shrink-0 w-60">
                  <div
                    className={cn(
                      "rounded-xl border flex flex-col max-h-[calc(100vh-18rem)]",
                      stage.color,
                    )}
                  >
                    {/* Column header */}
                    <div className="px-3 py-2.5 flex items-center gap-2">
                      <span className="text-sm font-semibold flex-1">
                        {stage.label}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums bg-background/60 rounded-full px-1.5 py-0.5">
                        {stageDeals.length}
                      </span>
                      <AddDealDialog
                        defaultStage={stage.key}
                        onCreated={(deal) =>
                          setDeals((prev) => [deal, ...prev])
                        }
                        trigger={
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="size-4" />
                          </button>
                        }
                      />
                    </div>

                    {/* Stage value */}
                    {stageDeals.length > 0 && (
                      <div className="px-3 pb-2">
                        <p className="text-xs text-muted-foreground font-medium">
                          {getFmtCurrencyVal(stageValue, "USD")}
                        </p>
                      </div>
                    )}

                    {/* Cards */}
                    <Droppable droppableId={stage.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "flex-1 overflow-y-auto p-2 space-y-2 min-h-[3rem] rounded-b-xl transition-colors",
                            snapshot.isDraggingOver && "bg-primary/5",
                          )}
                        >
                          {stageDeals.map((deal, idx) => (
                            <Draggable
                              key={deal._id}
                              draggableId={deal._id}
                              index={idx}
                            >
                              {(provided, snapshot) => (
                                <DealCard
                                  deal={deal}
                                  provided={provided}
                                  isDragging={snapshot.isDragging}
                                  onDelete={() => handleDelete(deal._id)}
                                  onUpdated={handleUpdate}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {stageDeals.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">
                              No deals
                            </p>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </section>
  );
};

export default Pipeline;
