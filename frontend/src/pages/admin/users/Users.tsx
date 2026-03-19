import {} from "react";
import CustomTable from "@/components/CustomTable";
import { useListData } from "@/hooks/useListData";
import TableSkeleton from "@/components/TableSkeleton";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";

const Users = () => {
  const { has } = usePermissions();
  const { data, isLoading, setData } = useListData<any>((signal) => apiUsers.getAll!(signal, true));
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    apiUsers.remove!(id, "", true).then((res) => {
      if (res?.status === "200" || res?.message) {
        setData((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Failed to delete user");
      }
    });
  };

  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Company", name: "company" },
    {
      label: "Joined",
      name: "date",
      options: { sortable: true, customBodyRender: (val: string) => <span>{convertDateToDateWithoutTime(val)}</span> },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const user = data[rowIndex];
          if (!user) return null;
          return (
            <div className="flex items-center gap-1">
              {has("users-edit") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => navigate(`edit-user/${user._id}`)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {has("users-delete") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(user._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage team members and their roles</p>
        </div>
        {has("users-edit") && (
          <Link to="add-user">
            <Button>
              <Plus className="h-4 w-4" /> Add User
            </Button>
          </Link>
        )}
      </div>
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <CustomTable columns={columns} data={data} title="Users" downloadName="users" />
      )}
    </section>
  );
};

export default Users;
