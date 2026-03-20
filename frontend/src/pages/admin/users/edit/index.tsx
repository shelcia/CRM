import { useEffect, useState } from "react";
import {
  CustomMultipleCheckBoxField,
  CustomTextField,
  PageHeader,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import { ArrowLeft, UserRound, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PERMISSION_GROUPS } from "../constants";

const permissionsToChecked = (permissions: string[]) => {
  const isAdmin = permissions.includes("admin");
  return PERMISSION_GROUPS.map((g) =>
    g.keys.map((k) => isAdmin || permissions.includes(k)),
  );
};

const checkedToPermissions = (checked: boolean[][]) =>
  PERMISSION_GROUPS.flatMap((g, gi) =>
    g.keys.filter((_, ki) => checked[gi][ki]),
  );

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [checked, setChecked] = useState<boolean[][]>(
    PERMISSION_GROUPS.map((g) => g.keys.map(() => true)),
  );

  const { errors, values, handleChange, handleSubmit, touched, setValues } =
    useFormik({
      initialValues: { name: "", email: "" },
      validationSchema: Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required"),
      }),
      onSubmit: (vals) => {
        setIsLoading(true);
        const permissions = checkedToPermissions(checked);
        const controller = new AbortController();
        apiUsers.putById!(
          id!,
          { ...vals, permissions },
          controller.signal,
          "",
          true,
        ).then((res) => {
          if (res?._id || res?.status === "200") {
            toast.success("User updated");
            navigate("/dashboard/users");
          } else {
            toast.error(res?.message ?? "Failed to update user");
          }
          setIsLoading(false);
        });
      },
    });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    apiUsers.getSingle!(id, controller.signal, "", true).then((res) => {
      if (res?._id || res?.name) {
        setValues({ name: res.name, email: res.email });
        if (Array.isArray(res.permissions)) {
          setChecked(permissionsToChecked(res.permissions));
        }
      } else {
        toast.error("User not found");
        navigate("/dashboard/users");
      }
      setIsFetching(false);
    });
    return () => controller.abort();
  }, [id]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  return (
    <section className="max-w-3xl space-y-6">
      {/* Header */}
      <PageHeader
        title="Edit User"
        description="Update profile and permissions"
        isBackButton
      />

      {/* Profile Info Card */}
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
          Save
        </Button>
      </div>
    </section>
  );
};

export default EditUser;
