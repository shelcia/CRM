import React, { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { apiTickets } from "@/services/models/ticketsModel";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    apiTickets.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setTickets(res);
    });
    return () => controller.abort();
  }, []);

  const columns = [
    { label: "Title", name: "title" },
    { label: "Contact", name: "contact" },
    { label: "Category", name: "category" },
    { label: "Priority", name: "priority" },
    { label: "Status", name: "status" },
    { label: "Assigned To", name: "assignedTo" },
    {
      label: "Created At",
      name: "createdAt",
      options: { customBodyRender: (data) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-3">
        <Link to="/dashboard/tickets/add-ticket">
          <Button>
            <Plus className="h-4 w-4" /> Add Ticket
          </Button>
        </Link>
      </div>
      <CustomTable columns={columns} data={tickets} title="Tickets" downloadName="tickets" />
    </>
  );
};

export default Tickets;
