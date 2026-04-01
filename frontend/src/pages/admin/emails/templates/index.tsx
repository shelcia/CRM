import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import toast from "react-hot-toast";
import {
  CustomTable,
  TableSkeleton,
  StatCard,
  PageHeader,
  DeleteIconButton,
  EditIconButton,
  AddPrimaryButton,
} from "@/components/custom";
import { apiEmailTemplates } from "@/services/models/emailTemplatesModel";
import { apiEmailGroups } from "@/services/models/emailGroupsModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils";
import { EmailGroup, EmailTemplate } from "../types";
import TemplateDialog from "../components/TemplateDialog";
import { frequencyLabel } from "../constants";
import { scheduleLabel } from "../helpers";
import { StatusBadge } from "@/components/common";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { emailTemplateStatuses, emailTemplateFrequencies } = useEnums();
  const statusItems = toLabelItems(emailTemplateStatuses);
  const frequencyItems = toLabelItems(emailTemplateFrequencies);

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiEmailTemplates.getAll!(controller.signal, true),
      apiEmailGroups.getAll!(controller.signal, true),
    ]).then(([tmplRes, groupRes]) => {
      if (Array.isArray(tmplRes)) setTemplates(tmplRes);
      if (Array.isArray(groupRes)) setGroups(groupRes);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (search) {
        const s = search.toLowerCase();
        if (!t.name?.toLowerCase().includes(s) && !t.subject?.toLowerCase().includes(s))
          return false;
      }
      if (filters.name && !t.name?.toLowerCase().includes(filters.name.toLowerCase()))
        return false;
      if (filters.frequency && t.frequency !== filters.frequency) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.sendDateFrom && t.sendDate < filters.sendDateFrom) return false;
      if (filters.sendDateTo && t.sendDate > filters.sendDateTo) return false;
      return true;
    });
  }, [templates, search, filters]);

  const handleSaved = (updated: EmailTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t._id === updated._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  const handleDelete = (_id: string) => {
    apiEmailTemplates.remove!(_id, "", true).then((res) => {
      if (res && res.message === "Email template deleted") {
        setTemplates((prev) => prev.filter((t) => t._id !== _id));
        toast.success("Template deleted");
      } else {
        toast.error(res?.message ?? "Failed to delete template");
      }
    });
  };

  const columns = [
    {
      label: "Name",
      name: "name",
      options: {
        customBodyRender: (val: any) => (
          <span className="font-medium">{val}</span>
        ),
      },
    },
    { label: "Subject", name: "subject" },
    { label: "Recipient(s)", name: "recipient" },
    {
      label: "Frequency",
      name: "frequency",
      options: {
        sortable: true,
        customBodyRender: (val: any) => (
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {frequencyLabel[val as keyof typeof frequencyLabel]}
          </div>
        ),
      },
    },
    {
      label: "Schedule",
      name: "sendDate",
      options: {
        sortable: true,
        customBodyRender: (_: any, rowIndex: number) => {
          const t = filteredTemplates[rowIndex];
          return <span>{t ? scheduleLabel(t) : "—"}</span>;
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        sortable: true,
        customBodyRender: (val: any) => (
          <StatusBadge value={val} className="capitalize" />
        ),
      },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = filteredTemplates[rowIndex];
          if (!t) return null;
          return (
            <div className="flex items-center gap-1">
              <TemplateDialog
                template={t}
                onSaved={handleSaved}
                statusItems={statusItems}
                frequencyItems={frequencyItems}
                groups={groups}
                trigger={<EditIconButton onClick={() => {}} />}
              />
              <DeleteIconButton onClick={() => handleDelete(t._id)} />
            </div>
          );
        },
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Email Templates"
        description="Manage your email templates"
        actions={
          <TemplateDialog
            onSaved={handleSaved}
            statusItems={statusItems}
            frequencyItems={frequencyItems}
            groups={groups}
            trigger={
              <AddPrimaryButton text="New Template" onClick={() => {}} />
            }
          />
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total" value={templates.length} />
        {emailTemplateStatuses.map((status) => (
          <StatCard
            key={status}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            value={templates.filter((t) => t.status === status).length}
          />
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : (
        <CustomTable
          columns={columns}
          data={filteredTemplates}
          title="Templates"
          downloadName="email-templates"
          serverSide={{
            total: filteredTemplates.length,
            page: 1,
            pageSize: filteredTemplates.length || 1,
            onPageChange: () => {},
            onSearchChange: setSearch,
            loading: false,
            columnFilters: {
              name: {
                type: "text",
                value: filters.name ?? "",
                onChange: (v) => handleFilterChange("name", v),
              },
              frequency: {
                options: emailTemplateFrequencies,
                value: filters.frequency ?? "",
                onChange: (v) => handleFilterChange("frequency", v),
              },
              sendDate: {
                type: "date",
                value: filters.sendDateFrom ?? "",
                onChange: (v) => handleFilterChange("sendDateFrom", v),
                valueTo: filters.sendDateTo ?? "",
                onChangeTo: (v) => handleFilterChange("sendDateTo", v),
              },
              status: {
                options: emailTemplateStatuses,
                value: filters.status ?? "",
                onChange: (v) => handleFilterChange("status", v),
              },
            },
          }}
        />
      )}
    </section>
  );
};

export default EmailTemplates;
