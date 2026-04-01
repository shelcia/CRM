import { useEffect, useState } from "react";
import {
  CustomTable,
  TableSkeleton,
  PageHeader,
  CustomEmptyState,
  DeleteIconButton,
  EditIconButton,
  AddPrimaryButton,
} from "@/components/custom";
import { useEnums } from "@/hooks/useEnums";
import {
  AssignedToDisplay,
  PriorityIndicator,
  StatusBadge,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Plus, TicketCheck, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { convertDateToDateWithoutTime } from "@/utils";
import { apiTickets } from "@/services/models/ticketsModel";
import { confirmToast } from "@/utils/confirmToast";
import toast from "react-hot-toast";
import TicketPanel from "./components/TicketPanel";
import usePermissions from "@/hooks/usePermissions";

const PAGE_SIZE = 50;

const PRIORITY_ORDER: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

const Tickets = () => {
  const { has } = usePermissions();
  const { ticketStatuses, ticketPriorities, ticketCategories } = useEnums();
  const [tickets, setTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [panelTicket, setPanelTicket] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const openPanel = (ticket: any) => {
    setPanelTicket(ticket);
    setPanelOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setIsLoading(true);
    const params: Record<string, unknown> = { page, limit: PAGE_SIZE };
    if (search)            params.search   = search;
    if (filters.title)     params.title    = filters.title;
    if (filters.contact)   params.contact  = filters.contact;
    if (filters.status)    params.status   = filters.status;
    if (filters.priority)  params.priority = filters.priority;
    if (filters.category)  params.category = filters.category;
    apiTickets.getByParams!(params, ctrl.signal, "", true).then((res) => {
      if (cancelled) return;
      if (res?.data) {
        setTickets(res.data);
        setTotal(res.total ?? 0);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [page, search, filters]);

  const columns = [
    { label: "Title", name: "title" },
    { label: "Contact", name: "contact" },
    {
      label: "Category",
      name: "category",
      options: {
        sortable: true,
        customBodyRender: (val: string) =>
          val ? (
            <StatusBadge value={val} />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
    },
    {
      label: "Priority",
      name: "priority",
      options: {
        sortable: true,
        sortValue: (row: any) => PRIORITY_ORDER[row.priority] ?? 0,
        customBodyRender: (val: string) => <PriorityIndicator value={val} />,
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        sortable: true,
        customBodyRender: (val: string) => <StatusBadge value={val} />,
      },
    },
    {
      label: "Assigned To",
      name: "assignedTo",
      options: {
        sortable: true,
        customBodyRender: (val: string) => <AssignedToDisplay name={val} />,
      },
    },
    {
      label: "Created At",
      name: "createdAt",
      options: {
        sortable: true,
        customBodyRender: (data: string) => (
          <span>{convertDateToDateWithoutTime(data)}</span>
        ),
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
                <EditIconButton
                  size="icon-sm"
                  onClick={() => openPanel(ticket)}
                />
              )}
              {has("tickets-delete") && (
                <DeleteIconButton
                  size="icon-sm"
                  onClick={() =>
                    confirmToast({
                      title: `Delete "${ticket?.title}"?`,
                      onConfirm: async () => {
                        const res = await apiTickets.remove!(
                          ticket._id,
                          "",
                          true,
                        );
                        if (res?.message === "Ticket deleted" || !res?.error) {
                          setTickets((prev) =>
                            prev.filter((t) => t._id !== ticket._id),
                          );
                          setTotal((t) => t - 1);
                          if (panelTicket?._id === ticket._id)
                            setPanelOpen(false);
                          toast.success("Ticket deleted");
                        } else {
                          toast.error(
                            res?.message ?? "Failed to delete ticket",
                          );
                        }
                      },
                    })
                  }
                />
              )}
            </div>
          );
        },
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Tickets"
        description="Track and resolve customer support requests"
        actions={
          has("tickets-edit") && (
            <Link to="/dashboard/tickets/add-ticket">
              <AddPrimaryButton text="Add Ticket" onClick={() => {}} />
            </Link>
          )
        }
      />

      {isLoading && tickets.length === 0 ? (
        <TableSkeleton rows={6} cols={8} />
      ) : total === 0 && !search ? (
        <CustomEmptyState
          icon={TicketCheck}
          title="No tickets yet"
          description="Create your first support ticket to get started."
          action={
            has("tickets-edit") && (
              <Link to="/dashboard/tickets/add-ticket">
                <AddPrimaryButton
                  text="Create First Ticket"
                  onClick={() => {}}
                />
              </Link>
            )
          }
        />
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
            onSearchChange: (s) => {
              setSearch(s);
              setPage(1);
            },
            loading: isLoading,
            columnFilters: {
              title:    { type: "text", value: filters.title   ?? "", onChange: (v) => handleFilterChange("title",   v) },
              contact:  { type: "text", value: filters.contact ?? "", onChange: (v) => handleFilterChange("contact", v) },
              status:   { options: ticketStatuses,   value: filters.status   ?? "", onChange: (v) => handleFilterChange("status",   v) },
              priority: { options: ticketPriorities, value: filters.priority ?? "", onChange: (v) => handleFilterChange("priority", v) },
              category: { options: ticketCategories, value: filters.category ?? "", onChange: (v) => handleFilterChange("category", v) },
            },
          }}
        />
      )}

      <TicketPanel
        ticket={panelTicket}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUpdate={(updated) => {
          setTickets((prev) =>
            prev.map((t) => (t._id === updated._id ? updated : t)),
          );
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
