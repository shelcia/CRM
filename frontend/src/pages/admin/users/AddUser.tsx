import { useState } from "react";
import { CustomMultipleCheckBoxField, CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import { ArrowLeft, UserRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PERMISSION_GROUPS = [
  {
    label: "Users",
    keys: ["users-view", "users-edit", "users-delete"],
    labels: ["View", "Edit", "Delete"],
  },
  {
    label: "Contacts",
    keys: ["contacts-view", "contacts-edit", "contacts-delete"],
    labels: ["View", "Edit", "Delete"],
  },
  {
    label: "Tickets",
    keys: ["tickets-view", "tickets-edit", "tickets-delete"],
    labels: ["View", "Edit", "Delete"],
  },
  {
    label: "Todos",
    keys: ["todos-view", "todos-edit", "todos-delete"],
    labels: ["View", "Edit", "Delete"],
  },
  { label: "Admin", keys: ["admin"], labels: ["Admin"] },
];

const checkedToPermissions = (checked: boolean[][]) =>
  PERMISSION_GROUPS.flatMap((g, gi) =>
    g.keys.filter((_, ki) => checked[gi][ki]),
  );

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState<boolean[][]>(
    PERMISSION_GROUPS.map((g) => g.keys.map(() => true)),
  );

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (vals) => {
      setIsLoading(true);
      const permissions = checkedToPermissions(checked);
      apiUsers.post({ ...vals, permissions }, "", true).then((res) => {
        if (res.status === "200" || res?._id) {
          toast.success("User invited successfully");
        } else {
          toast.error(res?.message ?? "Failed to invite user");
        }
        setIsLoading(false);
      });
    },
  });

  return (
    <section className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard/users">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add User</h1>
          <p className="text-sm text-muted-foreground">
            Invite a new member to your workspace
          </p>
        </div>
      </div>

      {/* Profile + Basic Info Card */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <UserRound className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Profile Information</span>
        </div>
        <CardContent className="pt-6">
          <div className="flex gap-6 items-start">
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-9 w-9 text-primary/60" />
              </div>
              <span className="text-xs text-muted-foreground">Photo</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="Name"
                name="name"
                placeholder="ex: Jane Smith"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomTextField
                label="Email"
                name="email"
                placeholder="ex: jane@company.com"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomTextField
                label="Password"
                name="password"
                placeholder="Enter password"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
                type="password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Card */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Permissions</span>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {PERMISSION_GROUPS.map((group, gi) => (
              <CustomMultipleCheckBoxField
                key={group.label}
                label={group.label}
                labelItms={group.labels}
                checked={checked[gi]}
                setChecked={(val) =>
                  setChecked((prev) => {
                    const next = [...prev];
                    next[gi] = val;
                    return next;
                  })
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link to="/dashboard/users">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button loading={isLoading} onClick={() => handleSubmit()}>
          Invite User
        </Button>
      </div>
    </section>
  );
};

export default AddUser;
