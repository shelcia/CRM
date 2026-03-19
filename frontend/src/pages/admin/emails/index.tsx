import { useEffect, useState } from "react";
import { Plus, Mail, Clock, Pencil, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  CustomTable,
  TableSkeleton,
  StatCard,
  PageHeader,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiEmailTemplates } from "@/services/models/emailTemplatesModel";
import { apiEmailGroups } from "@/services/models/emailGroupsModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils";
import { confirmToast } from "@/utils/confirmToast";
import { EmailGroup, EmailTemplate } from "./types";
import TemplateDialog from "./components/TemplateDialog";
import GroupDialog from "./components/GroupDialog";
import { frequencyLabel, statusStyles } from "./constants";
import { scheduleLabel } from "./helpers";

const Emails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"templates" | "groups">("templates");
  const { emailTemplateStatuses, emailTemplateFrequencies } = useEnums();
  const statusItems = toLabelItems(emailTemplateStatuses);
  const frequencyItems = toLabelItems(emailTemplateFrequencies);

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

  const handleGroupSaved = (updated: EmailGroup) => {
    setGroups((prev) => {
      const idx = prev.findIndex((g) => g._id === updated._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  const handleGroupDelete = (_id: string, name: string) => {
    confirmToast({
      title: `Delete "${name}"?`,
      description: "Templates using this group will lose their recipient.",
      onConfirm: async () => {
        const res = await apiEmailGroups.remove!(_id, "", true);
        if (res?.message === "Email group deleted" || res?._id || !res?.error) {
          setGroups((prev) => prev.filter((g) => g._id !== _id));
          toast.success("Group deleted");
        } else {
          toast.error(res?.message ?? "Failed to delete group");
        }
      },
    });
  };

  const columns = [
    {
      label: "Name",
      name: "name",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = templates[rowIndex];
          return (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium">{t?.name}</span>
            </div>
          );
        },
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
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
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
          const t = templates[rowIndex];
          return (
            <span className="text-muted-foreground text-xs">
              {t ? scheduleLabel(t) : "—"}
            </span>
          );
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        sortable: true,
        customBodyRender: (val: any) => (
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              statusStyles[val as keyof typeof statusStyles],
            )}
          >
            {val}
          </span>
        ),
      },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = templates[rowIndex];
          if (!t) return null;
          return (
            <div className="flex items-center gap-1">
              <TemplateDialog
                template={t}
                onSaved={handleSaved}
                statusItems={statusItems}
                frequencyItems={frequencyItems}
                groups={groups}
                trigger={
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => handleDelete(t._id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Emails"
        description="Manage templates and contact groups"
        actions={
          <>
            <div className="flex rounded-lg border overflow-hidden text-sm">
              <button
                onClick={() => setTab("templates")}
                className={cn(
                  "px-4 py-1.5 font-medium transition-colors",
                  tab === "templates"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                <Mail className="h-3.5 w-3.5 inline mr-1.5 -mt-px" /> Templates
              </button>
              <button
                onClick={() => setTab("groups")}
                className={cn(
                  "px-4 py-1.5 font-medium transition-colors",
                  tab === "groups"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                <Users className="h-3.5 w-3.5 inline mr-1.5 -mt-px" /> Groups
              </button>
            </div>
            {tab === "templates" ? (
              <TemplateDialog
                onSaved={handleSaved}
                statusItems={statusItems}
                frequencyItems={frequencyItems}
                groups={groups}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4" /> New Template
                  </Button>
                }
              />
            ) : (
              <GroupDialog
                onSaved={handleGroupSaved}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4" /> New Group
                  </Button>
                }
              />
            )}
          </>
        }
      />

      {tab === "templates" && (
        <>
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
              data={templates}
              title="Templates"
              downloadName="email-templates"
            />
          )}
        </>
      )}

      {tab === "groups" && (
        <>
          {isLoading ? (
            <TableSkeleton rows={3} cols={4} />
          ) : groups.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="font-medium">No groups yet</p>
              <p className="text-sm text-muted-foreground">
                Create a group to target specific contacts in your templates.
              </p>
              <GroupDialog
                onSaved={handleGroupSaved}
                trigger={
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> Create First Group
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Contacts
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr
                      key={g._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{g.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {g.description || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                          <Users className="h-3 w-3" /> {g.contactIds.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <GroupDialog
                            group={g}
                            onSaved={handleGroupSaved}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleGroupDelete(g._id, g.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Emails;
