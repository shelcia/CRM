import React, { useState } from "react";
import {
  CustomMultipleCheckBoxField,
  CustomSelectField,
  CustomTextField,
} from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";
import { ArrowLeft, UserRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { roles } = useEnums();
  const [checkedUsers, setCheckedUsers] = useState([true, true, true]);
  const [checkedContacts, setCheckedContacts] = useState([true, true, true]);
  const [checkedTickets, setCheckedTickets] = useState([true, true, true]);
  const [checkedTodos, setCheckedTodos] = useState([true, true, true]);

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { name: "", email: "", role: "non-admin", permissions: ["users-view"], password: "" },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required !"),
      email: Yup.string().email("Enter valid email!").required("Email is required !"),
      role: Yup.string(),
      permissions: Yup.array(),
      password: Yup.string().required("Password is required !"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiUsers.post({ ...values, company: "nasdaq" }, "", true).then((res) => {
        if (res.status === "200") {
          toast.success("User has been invited");
        } else {
          toast.error(res.message);
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
          <p className="text-sm text-muted-foreground">Invite a new member to your workspace</p>
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
            {/* Avatar placeholder */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-9 w-9 text-primary/60" />
              </div>
              <span className="text-xs text-muted-foreground">Photo</span>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="Name"
                name="name"
                placeholder="ex: Ram"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomTextField
                label="Email"
                name="email"
                placeholder="ex: james@company.com"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomSelectField
                label="Role"
                name="role"
                placeholder="role"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
                labelItms={toLabelItems(roles)}
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
            <CustomMultipleCheckBoxField
              label="Users"
              labelItms={["View", "Edit", "Delete"]}
              checked={checkedUsers}
              setChecked={setCheckedUsers}
            />
            <CustomMultipleCheckBoxField
              label="Contacts"
              labelItms={["View", "Edit", "Delete"]}
              checked={checkedContacts}
              setChecked={setCheckedContacts}
            />
            <CustomMultipleCheckBoxField
              label="Tickets"
              labelItms={["View", "Edit", "Delete"]}
              checked={checkedTickets}
              setChecked={setCheckedTickets}
            />
            <CustomMultipleCheckBoxField
              label="Todos"
              labelItms={["View", "Edit", "Delete"]}
              checked={checkedTodos}
              setChecked={setCheckedTodos}
            />
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
