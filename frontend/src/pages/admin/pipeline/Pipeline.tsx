import { useEffect, useState } from "react";
import { Plus, Trash2, TrendingUp, DollarSign, Target, Pencil } from "lucide-react";
import AuthorAvatar from "@/components/AuthorAvatar";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTextField, CustomSelectField } from "@/components/CustomInputs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiDeals } from "@/services/models/dealsModel";
import useUsers from "@/hooks/useUsers";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Deal {
  _id: string;
  title: string;
  contactId?: string;
  contactName?: string;
  value: number;
  currency: string;
  stage: string;
  assignedTo?: string;
  expectedClose?: string;
  createdAt: string;
}

// ── Stage config ──────────────────────────────────────────────────────────────

const STAGES: { key: string; label: string; color: string; dot: string }[] = [
  { key: "lead",        label: "Lead",        color: "bg-slate-100 dark:bg-slate-800",  dot: "bg-slate-400" },
  { key: "qualified",   label: "Qualified",   color: "bg-blue-50 dark:bg-blue-950",     dot: "bg-blue-500" },
  { key: "proposal",    label: "Proposal",    color: "bg-amber-50 dark:bg-amber-950",   dot: "bg-amber-500" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-50 dark:bg-orange-950", dot: "bg-orange-500" },
  { key: "won",         label: "Won",         color: "bg-primary/5",                    dot: "bg-primary" },
  { key: "lost",        label: "Lost",        color: "bg-red-50 dark:bg-red-950",       dot: "bg-red-500" },
];

const stageMeta = Object.fromEntries(STAGES.map((s) => [s.key, s]));

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (val: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(val);

const fmtDate = (d?: string) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

// ── Deal card ─────────────────────────────────────────────────────────────────

const DealCard = ({
  deal,
  provided,
  isDragging,
  onDelete,
  onUpdated,
}: {
  deal: Deal;
  provided: any;
  isDragging: boolean;
  onDelete: () => void;
  onUpdated: (deal: Deal) => void;
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm group transition-shadow cursor-grab active:cursor-grabbing",
        isDragging && "shadow-lg ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug flex-1">{deal.title}</p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <AddDealDialog
            deal={deal}
            onUpdated={onUpdated}
            trigger={
              <Button size="icon-sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {deal.contactName && (
        <p className="text-xs text-muted-foreground mt-1 truncate">{deal.contactName}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-primary">
          {fmt(deal.value, deal.currency)}
        </span>
        {deal.expectedClose && (
          <span className="text-xs text-muted-foreground">{fmtDate(deal.expectedClose)}</span>
        )}
      </div>

      {deal.assignedTo && (
        <div className="flex items-center gap-1.5 mt-2">
          <AuthorAvatar name={deal.assignedTo} className="h-5 w-5 text-[9px]" />
          <span className="text-xs text-muted-foreground truncate">{deal.assignedTo}</span>
        </div>
      )}
    </div>
  );
};

// ── Add Deal dialog ───────────────────────────────────────────────────────────

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((c) => ({ val: c, label: c }));
const STAGE_ITEMS = STAGES.map((s) => ({ val: s.key, label: s.label }));

const AddDealDialog = ({
  deal,
  onCreated,
  onUpdated,
  defaultStage,
  defaultContactId,
  defaultContactName,
  trigger,
}: {
  deal?: Deal;
  onCreated?: (deal: Deal) => void;
  onUpdated?: (deal: Deal) => void;
  defaultStage?: string;
  defaultContactId?: string;
  defaultContactName?: string;
  trigger: React.ReactNode;
}) => {
  const isEdit = !!deal;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { userItems } = useUsers();

  const { values, errors, touched, handleChange, handleSubmit, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: deal?.title ?? "",
      contactName: deal?.contactName ?? defaultContactName ?? "",
      contactId: deal?.contactId ?? defaultContactId ?? "",
      value: deal?.value?.toString() ?? "",
      currency: deal?.currency ?? "USD",
      stage: deal?.stage ?? defaultStage ?? "lead",
      assignedTo: deal?.assignedTo ?? "",
      expectedClose: deal?.expectedClose ? deal.expectedClose.slice(0, 10) : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      value: Yup.number().min(0, "Must be ≥ 0").required("Value is required"),
      currency: Yup.string().required(),
      stage: Yup.string().required(),
    }),
    onSubmit: (vals) => {
      setSaving(true);
      const payload = {
        title: vals.title,
        contactName: vals.contactName || undefined,
        contactId: vals.contactId || undefined,
        value: Number(vals.value),
        currency: vals.currency,
        stage: vals.stage,
        assignedTo: vals.assignedTo || undefined,
        expectedClose: vals.expectedClose || undefined,
      };
      if (isEdit) {
        apiDeals.putById!(deal._id, payload, new AbortController().signal, "", true).then((res) => {
          setSaving(false);
          if (res?._id) {
            toast.success("Deal updated");
            onUpdated?.(res as Deal);
            setOpen(false);
          } else {
            toast.error(res?.message ?? "Failed to update deal");
          }
        });
      } else {
        apiDeals.post!(payload, "", true).then((res) => {
          setSaving(false);
          if (res?._id) {
            toast.success("Deal created");
            onCreated?.(res as Deal);
            setOpen(false);
            resetForm();
          } else {
            toast.error(res?.message ?? "Failed to create deal");
          }
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v && !isEdit) resetForm(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Deal" : "New Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <CustomTextField
            label="Title"
            name="title"
            placeholder="e.g. Acme Corp — Enterprise Plan"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <CustomTextField
            label="Contact"
            name="contactName"
            placeholder="Contact name"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <div className="grid grid-cols-2 gap-3">
            <CustomTextField
              label="Value"
              name="value"
              type="number"
              placeholder="0"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomSelectField
              label="Currency"
              name="currency"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={CURRENCIES}
            />
          </div>
          <CustomSelectField
            label="Stage"
            name="stage"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={STAGE_ITEMS}
          />
          <div className="space-y-1">
            <Label htmlFor="expectedClose">Expected Close</Label>
            <Input
              id="expectedClose"
              name="expectedClose"
              type="date"
              value={values.expectedClose}
              onChange={handleChange}
            />
          </div>
          <CustomSelectField
            label="Assigned To"
            name="assignedTo"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={[{ val: "", label: "Unassigned" }, ...userItems]}
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => { setOpen(false); if (!isEdit) resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>{isEdit ? "Save Changes" : "Create Deal"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Pipeline page ────────────────────────────────────────────────────────

const Pipeline = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    apiDeals.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setDeals(res);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const dealsByStage = (stage: string) => deals.filter((d) => d.stage === stage);

  const totalValue = deals
    .filter((d) => d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter((d) => d.stage === "won");
  const closedDeals = deals.filter((d) => d.stage === "won" || d.stage === "lost");
  const winRate = closedDeals.length > 0
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

    apiDeals.putById!(draggableId, { ...deal, stage: newStage }, new AbortController().signal, "", true)
      .then((res) => {
        if (!res?._id) {
          // revert
          setDeals((prev) =>
            prev.map((d) => (d._id === draggableId ? { ...d, stage: deal.stage } : d)),
          );
          toast.error("Failed to move deal");
        }
      });
  };

  const handleUpdate = (updated: Deal) => {
    setDeals((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Track deals across every stage</p>
        </div>
        <AddDealDialog
          onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              New Deal
            </Button>
          }
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pipeline Value" value={fmt(totalValue, "USD")} icon={DollarSign} />
        <StatCard label="Total Deals" value={deals.length} icon={Target} />
        <StatCard label="Win Rate" value={`${winRate}%`} icon={TrendingUp} />
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div key={s.key} className="flex-shrink-0 w-60 h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 items-start">
            {STAGES.map((stage) => {
              const stageDeals = dealsByStage(stage.key);
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);

              return (
                <div key={stage.key} className="flex-shrink-0 w-60">
                  <div className={cn("rounded-xl border flex flex-col max-h-[calc(100vh-18rem)]", stage.color)}>
                    {/* Column header */}
                    <div className="px-3 py-2.5 flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", stage.dot)} />
                      <span className="text-sm font-semibold flex-1">{stage.label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums bg-background/60 rounded-full px-1.5 py-0.5">
                        {stageDeals.length}
                      </span>
                      <AddDealDialog
                        defaultStage={stage.key}
                        onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
                        trigger={
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        }
                      />
                    </div>

                    {/* Stage value */}
                    {stageDeals.length > 0 && (
                      <div className="px-3 pb-2">
                        <p className="text-xs text-muted-foreground font-medium">
                          {fmt(stageValue, "USD")}
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
                            <Draggable key={deal._id} draggableId={deal._id} index={idx}>
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

// ── Exported for ContactPanel use ─────────────────────────────────────────────
export { AddDealDialog };
export type { Deal };
