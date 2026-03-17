import React, { useEffect, useState } from "react";
import { CustomBasicHorizontalTable } from "@/components/CustomBasicTable";
import CustomModal from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import AddContact from "./AddContact";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiContacts } from "@/services/models/contactsModel";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAddContactModal, setOpenAddContactModal] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiContacts.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setContacts(res);
    });
    return () => controller.abort();
  }, []);

  const handleContactAdded = (newContact) => {
    setContacts((prev) => [newContact, ...prev]);
    setOpenAddContactModal(false);
  };

  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone No.", name: "number" },
    { label: "Company", name: "company" },
    {
      label: "Last Activity",
      name: "lastActivity",
      options: { customBodyRender: (data) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
    { label: "Lead Status", name: "status" },
    {
      label: "Created At",
      name: "createdAt",
      options: { customBodyRender: (data) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
    {
      label: "Actions",
      name: "url",
      options: {
        customBodyRender: (_val, rowIdx = 0) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIndex(rowIdx);
              setOpen(true);
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
      <div className="flex justify-end mb-3">
        <Button onClick={() => setOpenAddContactModal(true)}>
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      <AddContact open={openAddContactModal} setOpen={setOpenAddContactModal} onAdded={handleContactAdded} />

      <CustomTable columns={columns} data={contacts} title="Contacts" downloadName="contacts" />

      <CustomModal open={open} onClose={() => setOpen(false)} title="More Contact Details">
        <CustomBasicHorizontalTable
          columns={[
            { title: "Name", field: "name" },
            { title: "Email", field: "email" },
            { title: "Phone No.", field: "number" },
            { title: "Company", field: "company" },
            { title: "Last Activity", field: "lastActivity" },
            { title: "Lead Status", field: "status" },
            { title: "Created At", field: "createdAt" },
          ]}
          data={contacts[index]}
        />
      </CustomModal>
    </>
  );
};

export default Contacts;
