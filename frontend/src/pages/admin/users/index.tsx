import {
  PageHeader,
  CustomTable,
  TableSkeleton,
  DeleteIconButton,
  EditIconButton,
  AddPrimaryButton,
} from "@/components/custom";
import { useListData } from "@/hooks/useListData";
import { convertDateToDateWithoutTime } from "@/utils";
import { Link, useNavigate } from "react-router-dom";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";

const Users = () => {
  const { has } = usePermissions();
  const { data, isLoading, setData } = useListData<any>((signal) =>
    apiUsers.getAll!(signal, true),
  );
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
      options: {
        sortable: true,
        customBodyRender: (val: string) => (
          <span>{convertDateToDateWithoutTime(val)}</span>
        ),
      },
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
                <EditIconButton
                  onClick={() => navigate(`edit-user/${user._id}`)}
                />
              )}
              {has("users-delete") && (
                <DeleteIconButton onClick={() => handleDelete(user._id)} />
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
        title="Users"
        description="Manage team members and their roles"
        actions={
          has("users-edit") && (
            <Link to="add-user">
              <AddPrimaryButton text="Add User" onClick={() => {}} />
            </Link>
          )
        }
      />
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          title="Users"
          downloadName="users"
        />
      )}
    </section>
  );
};

export default Users;
