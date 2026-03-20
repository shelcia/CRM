import { useState } from "react";
import {
  CustomMultipleCheckBoxField,
  CustomTextField,
  PageHeader,
  CardSection,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import { UserRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PERMISSION_GROUPS } from "../constants";
import { checkedToPermissions } from "../helpers";

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
    <section className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Add User"
        description="Invite a new member to your workspace"
        isBackButton
      />
      <div className="flex gap-2">
        <CardSection
          icon={<UserRound className="h-4 w-4 text-primary" />}
          title="Profile Information"
          className="w-full"
        >
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
        </CardSection>

        <CardSection
          icon={<ShieldCheck className="h-4 w-4 text-primary" />}
          title="Permissions"
          className="w-full"
        >
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
        </CardSection>
      </div>

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
