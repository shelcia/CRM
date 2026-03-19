import { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Plus, TicketCheck, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { apiTickets } from "@/services/models/ticketsModel";
import { confirmToast } from "@/utils/confirmToast";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityIndicator } from "@/components/PriorityIndicator";
import AuthorAvatar from "@/components/AuthorAvatar";
import TicketPanel from "./TicketPanel";
import usePermissions from "@/hooks/usePermissions";

const PAGE_SIZE = 50;

const Tickets = () => {
  const { has } = usePermissions();
  const [tickets, setTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [panelTicket, setPanelTicket] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDefaultEditing, setPanelDefaultEditing] = useState(false);

  const openPanel = (ticket: any, editing = false) => {
    setPanelTicket(ticket);
    setPanelDefaultEditing(editing);
    setPanelOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setIsLoading(true);
    const params: Record<string, unknown> = { page, limit: PAGE_SIZE };
    if (search) params.search = search;
    apiTickets.getByParams!(params, ctrl.signal, "", true).then((res) => {
      if (cancelled) return;
      if (res?.data) {
        setTickets(res.data);
        setTotal(res.total ?? 0);
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; ctrl.abort(); };
  }, [page, search]);

  const columns = [
    { label: "Title", name: "title" },
    { label: "Contact", name: "contact" },
    {
      label: "Category",
      name: "category",
      options: {
        customBodyRender: (val: string) =>
          val ? <StatusBadge value={val} /> : <span className="text-muted-foreground">—</span>,
      },
    },
    {
      label: "Priority",
      name: "priority",
      options: { customBodyRender: (val: string) => <PriorityIndicator value={val} /> },
    },
    {
      label: "Status",
      name: "status",
      options: { customBodyRender: (val: string) => <StatusBadge value={val} /> },
    },
    {
      label: "Assigned To",
      name: "assignedTo",
      options: {
        customBodyRender: (val: string) =>
          val ? (
            <div className="flex items-center gap-1.5">
              <AuthorAvatar name={val} />
              <span className="text-sm">{val}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
    },
    {
      label: "Created At",
      name: "createdAt",
      options: {
        sortable: true,
        customBodyRender: (data: string) => <span>{convertDateToDateWithoutTime(data)}</span>,
      },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_val: any, rowIdx = 0) => {
          const ticket = tickets[rowIdx];
          return (
            <div className="flex items-center gap-1">
              {has("tickets-edit") && (
                <Button size="icon-sm" variant="outline" onClick={() => openPanel(ticket, true)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {has("tickets-delete") && (
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() =>
                    confirmToast({
                      title: `Delete "${ticket?.title}"?`,
                      onConfirm: async () => {
                        const res = await apiTickets.remove!(ticket._id, "", true);
                        if (res?.message === "Ticket deleted" || !res?.error) {
                          setTickets((prev) => prev.filter((t) => t._id !== ticket._id));
                          setTotal((t) => t - 1);
                          if (panelTicket?._id === ticket._id) setPanelOpen(false);
                          toast.success("Ticket deleted");
                        } else {
                          toast.error(res?.message ?? "Failed to delete ticket");
                        }
                      },
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        },
      },
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-sm text-muted-foreground">Track and resolve customer support requests</p>
        </div>
        {has("tickets-edit") && (
          <Link to="/dashboard/tickets/add-ticket">
            <Button>
              <Plus className="h-4 w-4" /> Add Ticket
            </Button>
          </Link>
        )}
      </div>

      {isLoading && tickets.length === 0 ? (
        <TableSkeleton rows={6} cols={8} />
      ) : total === 0 && !search ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <TicketCheck className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No tickets yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first support ticket to get started.
            </p>
          </div>
          {has("tickets-edit") && (
            <Link to="/dashboard/tickets/add-ticket">
              <Button size="sm">
                <Plus className="h-4 w-4" /> Create First Ticket
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={tickets}
          title="Tickets"
          serverSide={{
            total,
            page,
            pageSize: PAGE_SIZE,
            onPageChange: setPage,
            onSearchChange: (s) => { setSearch(s); setPage(1); },
            loading: isLoading,
          }}
        />
      )}

      <TicketPanel
        ticket={panelTicket}
        open={panelOpen}
        defaultEditing={panelDefaultEditing}
        onClose={() => setPanelOpen(false)}
        onUpdate={(updated) => {
          setTickets((prev) => prev.map((t) => t._id === updated._id ? updated : t));
          setPanelTicket(updated);
        }}
        onDelete={(id) => {
          setTickets((prev) => prev.filter((t) => t._id !== id));
          setTotal((t) => t - 1);
          setPanelOpen(false);
        }}
      />
    </section>
  );
};

export default Tickets;
