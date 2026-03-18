import { useEffect, useRef, useState } from "react";
import CustomTable from "@/components/CustomTable";
import TableSkeleton from "@/components/TableSkeleton";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, FileDown } from "lucide-react";
import { apiContacts, exportContacts, importContacts } from "@/services/models/contactsModel";
import { Link } from "react-router-dom";
import ContactPanel from "./ContactPanel";
import toast from "react-hot-toast";

const CSV_TEMPLATE = "name,email,number,company,jobTitle,priority,companySize,probability,status\nJane Smith,jane@acme.com,+15550001234,Acme Corp,Product Manager,high,250,0.7,new";

const downloadTemplate = () => {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = "contacts_template.csv";
  a.click();
  URL.revokeObjectURL(href);
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [panelContact, setPanelContact] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContacts = () => {
    const controller = new AbortController();
    apiContacts.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setContacts(res);
      setIsLoading(false);
    });
    return controller;
  };

  useEffect(() => {
    const controller = fetchContacts();
    return () => controller.abort();
  }, []);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    importContacts(file)
      .then((res) => {
        if (res.imported > 0) {
          toast.success(`Imported ${res.imported} contact${res.imported !== 1 ? "s" : ""}`);
          fetchContacts();
        }
        if (res.skipped?.length) {
          toast.error(`${res.skipped.length} row(s) skipped — missing name`);
        }
      })
      .catch(() => toast.error("Import failed"))
      .finally(() => {
        setImporting(false);
        e.target.value = "";
      });
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
              setPanelContact(contacts[rowIdx]);
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleImportFile}
      />

      <div className="flex items-center justify-end gap-2 mb-3">
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <FileDown className="h-4 w-4" /> Template
        </Button>
        <Button variant="outline" size="sm" loading={importing} onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" /> Import CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportContacts().catch(() => toast.error("Export failed"))}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Link to="/dashboard/contacts/add-contact">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add Contact
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : (
        <CustomTable columns={columns} data={contacts} title="Contacts" downloadName="contacts" />
      )}

      <ContactPanel
        contact={panelContact}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
};

export default Contacts;
