import { useEffect, useState } from "react";
import { Plus, Pencil, Users } from "lucide-react";
import toast from "react-hot-toast";
import { CustomTable, TableSkeleton, PageHeader, DeleteIconButton } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { apiEmailGroups } from "@/services/models/emailGroupsModel";
import { confirmToast } from "@/utils/confirmToast";
import { EmailGroup } from "../types";
import GroupDialog from "../components/GroupDialog";

const EmailGroups = () => {
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    apiEmailGroups.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setGroups(res);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

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
    { label: "Name", name: "name" },
    {
      label: "Description",
      name: "description",
      options: {
        customBodyRender: (val: string) =>
          val ? val : <span className="text-muted-foreground">—</span>,
      },
    },
    {
      label: "Contacts",
      name: "contactIds",
      options: {
        customBodyRender: (val: string[]) => (
          <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
            <Users className="h-3 w-3" /> {val?.length ?? 0}
          </span>
        ),
      },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const g = groups[rowIndex];
          if (!g) return null;
          return (
            <div className="flex items-center gap-1">
              <GroupDialog
                group={g}
                onSaved={handleGroupSaved}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                  </Button>
                }
              />
              <DeleteIconButton onClick={() => handleGroupDelete(g._id, g.name)} />
            </div>
          );
        },
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Email Groups"
        description="Manage contact groups for email campaigns"
        actions={
          <GroupDialog
            onSaved={handleGroupSaved}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> New Group
              </Button>
            }
          />
        }
      />

      {isLoading ? (
        <TableSkeleton rows={3} cols={4} />
      ) : (
        <CustomTable
          columns={columns}
          data={groups}
          title="Groups"
          downloadName="email-groups"
        />
      )}
    </section>
  );
};

export default EmailGroups;
