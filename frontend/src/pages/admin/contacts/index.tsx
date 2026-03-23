import { useEffect, useRef, useState } from "react";
import {
  CustomTable,
  TableSkeleton,
  PageHeader,
  DeleteIconButton,
  EditIconButton,
  AddPrimaryButton,
} from "@/components/custom";
import { useEnums } from "@/hooks/useEnums";
import { convertDateToDateWithoutTime } from "@/utils";
import { Button } from "@/components/ui/button";
import { Upload, FileDown } from "lucide-react";
import { apiContacts, importContacts } from "@/services/models/contactsModel";
import { Link } from "react-router-dom";
import ContactPanel from "./components/ContactPanel";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";
import { confirmToast } from "@/utils/confirmToast";
import { CSV_TEMPLATE, PAGE_SIZE } from "./constants";
import { StatusBadge } from "@/components/common";

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
  const { contactStatuses, contactPriorities } = useEnums();
  const [contacts, setContacts] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [panelContact, setPanelContact] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [panelDefaultTab, setPanelDefaultTab] = useState<"activity" | "edit">(
    "activity",
  );
  const [importing, setImporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setIsLoading(true);
    const params: Record<string, unknown> = { page, limit: PAGE_SIZE };
    if (search) params.search = search;
    if (filters.status)           params.status           = filters.status;
    if (filters.priority)         params.priority         = filters.priority;
    if (filters.company)          params.company          = filters.company;
    if (filters.contactOwner)     params.contactOwner     = filters.contactOwner;
    if (filters.lastActivityFrom) params.lastActivityFrom = filters.lastActivityFrom;
    if (filters.lastActivityTo)   params.lastActivityTo   = filters.lastActivityTo;
    if (filters.dateFrom)         params.dateFrom         = filters.dateFrom;
    if (filters.dateTo)           params.dateTo           = filters.dateTo;
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
  }, [page, search, filters]);

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
    { label: "Owner", name: "contactOwner" },
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
                <EditIconButton onClick={() => openPanel(contact, "edit")} />
              )}
              {has("contacts-delete") && (
                <DeleteIconButton
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
        title="Contacts"
        description="Manage and track your leads and customers"
        actions={
          has("contacts-edit") && (
            <>
              <Button variant="outline" onClick={downloadTemplate}>
                <FileDown className="size-4" /> Template
              </Button>
              <Button
                variant="outline"
                loading={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" /> Import CSV
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </Button>
              <Link to="/dashboard/contacts/add-contact">
                <AddPrimaryButton text="Add Contact" onClick={() => {}} />
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
            columnFilters: {
              status: {
                options: contactStatuses,
                value: filters.status ?? "",
                onChange: (v) => handleFilterChange("status", v),
              },
              priority: {
                options: contactPriorities,
                value: filters.priority ?? "",
                onChange: (v) => handleFilterChange("priority", v),
              },
              company: {
                type: "text",
                value: filters.company ?? "",
                onChange: (v) => handleFilterChange("company", v),
              },
              contactOwner: {
                type: "text",
                value: filters.contactOwner ?? "",
                onChange: (v) => handleFilterChange("contactOwner", v),
              },
              lastActivity: {
                type: "date",
                value: filters.lastActivityFrom ?? "",
                onChange: (v) => handleFilterChange("lastActivityFrom", v),
                valueTo: filters.lastActivityTo ?? "",
                onChangeTo: (v) => handleFilterChange("lastActivityTo", v),
              },
              createdAt: {
                type: "date",
                value: filters.dateFrom ?? "",
                onChange: (v) => handleFilterChange("dateFrom", v),
                valueTo: filters.dateTo ?? "",
                onChangeTo: (v) => handleFilterChange("dateTo", v),
              },
            },
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
