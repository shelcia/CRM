import { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Plus, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { apiTickets } from "@/services/models/ticketsModel";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityIndicator } from "@/components/PriorityIndicator";
import TicketPanel from "./TicketPanel";
import usePermissions from "@/hooks/usePermissions";

const Tickets = () => {
  const { has } = usePermissions();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [panelTicket, setPanelTicket] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiTickets.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setTickets(res);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const columns = [
    { label: "Title", name: "title" },
    { label: "Contact", name: "contact" },
    { label: "Category", name: "category" },
    {
      label: "Priority",
      name: "priority",
      options: {
        customBodyRender: (val: string) => <PriorityIndicator value={val} />,
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        customBodyRender: (val: string) => <StatusBadge value={val} />,
      },
    },
    { label: "Assigned To", name: "assignedTo" },
    {
      label: "Created At",
      name: "createdAt",
      options: { customBodyRender: (data: string) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_val: any, rowIdx = 0) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPanelTicket(tickets[rowIdx]);
              setPanelOpen(true);
            }}
          >
            View
          </Button>
        ),
      },
    },
  ];

  return (
    <>
      {has("tickets-edit") && (
        <div className="flex justify-end mb-3">
          <Link to="/dashboard/tickets/add-ticket">
            <Button>
              <Plus className="h-4 w-4" /> Add Ticket
            </Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : tickets.length === 0 ? (
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
        <CustomTable columns={columns} data={tickets} title="Tickets" downloadName="tickets" />
      )}

      <TicketPanel
        ticket={panelTicket}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUpdate={(updated) => {
          setTickets((prev) => prev.map((t) => t._id === updated._id ? updated : t));
          setPanelTicket(updated);
        }}
        onDelete={(id) => {
          setTickets((prev) => prev.filter((t) => t._id !== id));
          setPanelOpen(false);
        }}
      />
    </>
  );
};

export default Tickets;
