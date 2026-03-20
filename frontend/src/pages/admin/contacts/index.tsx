import { useEffect, useRef, useState } from "react";
import {
  CustomTable,
  TableSkeleton,
  StatusBadge,
  PageHeader,
} from "@/components/custom";
import { convertDateToDateWithoutTime } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileDown, Pencil, Trash2 } from "lucide-react";
import { apiContacts, importContacts } from "@/services/models/contactsModel";
import { Link } from "react-router-dom";
import ContactPanel from "./components/ContactPanel";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";
import { confirmToast } from "@/utils/confirmToast";
import { CSV_TEMPLATE, PAGE_SIZE } from "./constants";

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
  const { has } = usePermissions();
  const [contacts, setContacts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [panelContact, setPanelContact] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDefaultTab, setPanelDefaultTab] = useState<"activity" | "edit">(
    "activity",
  );
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setIsLoading(true);
    const params: Record<string, unknown> = { page, limit: PAGE_SIZE };
    if (search) params.search = search;
    apiContacts.getByParams!(params, ctrl.signal, "", true).then((res) => {
      if (cancelled) return;
      if (res?.data) {
        setContacts(res.data);
        setTotal(res.total ?? 0);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [page, search]);

  const openPanel = (contact: any, tab: "activity" | "edit" = "activity") => {
    setPanelContact(contact);
    setPanelDefaultTab(tab);
    setPanelOpen(true);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    importContacts(file)
      .then((res) => {
        if (res.imported > 0) {
          toast.success(
            `Imported ${res.imported} contact${res.imported !== 1 ? "s" : ""}`,
          );
          setPage(1);
          setSearch("");
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
      options: {
        sortable: true,
        customBodyRender: (data: string) => (
          <span>{convertDateToDateWithoutTime(data)}</span>
        ),
      },
    },
    {
      label: "Lead Status",
      name: "status",
      options: {
        sortable: true,
        customBodyRender: (val: string) => <StatusBadge value={val} />,
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
      name: "url",
      options: {
        customBodyRender: (_val: any, rowIdx = 0) => {
          const contact = contacts[rowIdx];
          return (
            <div className="flex items-center gap-1">
              {has("contacts-edit") && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => openPanel(contact, "edit")}
                >
                  <Pencil className="size-4" />
                </Button>
              )}
              {has("contacts-delete") && (
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() =>
                    confirmToast({
                      title: `Delete "${contact?.name}"?`,
                      onConfirm: async () => {
                        const res = await apiContacts.remove!(
                          contact._id,
                          "",
                          true,
                        );
                        if (res?.message === "Contact deleted" || !res?.error) {
                          setContacts((prev) =>
                            prev.filter((c) => c._id !== contact._id),
                          );
                          setTotal((t) => t - 1);
                          if (panelContact?._id === contact._id)
                            setPanelOpen(false);
                          toast.success("Contact deleted");
                        } else {
                          toast.error(
                            res?.message ?? "Failed to delete contact",
                          );
                        }
                      },
                    })
                  }
                >
                  <Trash2 className="size-4" />
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleImportFile}
      />

      <PageHeader
        title="Contacts"
        description="Manage and track your leads and customers"
        actions={
          has("contacts-edit") && (
            <>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <FileDown className="h-4 w-4" /> Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                loading={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Import CSV
              </Button>
              <Link to="/dashboard/contacts/add-contact">
                <Button size="sm">
                  <Plus className="h-4 w-4" /> Add Contact
                </Button>
              </Link>
            </>
          )
        }
      />

      {isLoading && contacts.length === 0 ? (
        <TableSkeleton rows={6} cols={8} />
      ) : (
        <CustomTable
          columns={columns}
          data={contacts}
          title="Contacts"
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
          }}
        />
      )}

      <ContactPanel
        contact={panelContact}
        open={panelOpen}
        defaultTab={panelDefaultTab}
        onClose={() => setPanelOpen(false)}
        onUpdate={(updated) => {
          setContacts((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c)),
          );
          setPanelContact(updated);
        }}
        onDelete={(id) => {
          setContacts((prev) => prev.filter((c) => c._id !== id));
          setTotal((t) => t - 1);
          setPanelOpen(false);
        }}
      />
    </section>
  );
};

export default Contacts;
