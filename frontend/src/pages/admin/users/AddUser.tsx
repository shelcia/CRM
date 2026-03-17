import React, { useState } from "react";
import {
  CustomMultipleCheckBoxField,
  CustomSelectField,
  CustomTextField,
} from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "@/services/models/usersModel";
import toast from "react-hot-toast";

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    <section className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add User</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <form className="flex flex-col gap-5">
          <CustomTextField label="Name" name="name" placeholder="ex: Ram" values={values} handleChange={handleChange} touched={touched} errors={errors} />
          <CustomTextField label="Email" name="email" placeholder="ex: james@company.com" values={values} handleChange={handleChange} touched={touched} errors={errors} />
          <CustomSelectField
            label="Role"
            name="role"
            placeholder="role"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={[
              { val: "admin", label: "Admin" },
              { val: "non-admin", label: "Non Admin" },
            ]}
          />
          <CustomTextField label="password" name="password" placeholder="enter password" values={values} handleChange={handleChange} touched={touched} errors={errors} type="password" />
        </form>

        <div className="flex flex-col gap-5">
          <p className="text-lg font-semibold">Permissions</p>
          <div className="grid grid-cols-2 gap-4">
            <CustomMultipleCheckBoxField label="User" labelItms={["Users View", "Users Edit", "Users Delete"]} checked={checkedUsers} setChecked={setCheckedUsers} />
            <CustomMultipleCheckBoxField label="Contacts" labelItms={["Contacts View", "Contacts Edit", "Contacts Delete"]} checked={checkedContacts} setChecked={setCheckedContacts} />
            <CustomMultipleCheckBoxField label="Tickets" labelItms={["Tickets View", "Tickets Edit", "Tickets Delete"]} checked={checkedTickets} setChecked={setCheckedTickets} />
            <CustomMultipleCheckBoxField label="Todos" labelItms={["Todos View", "Todos Edit", "Todos Delete"]} checked={checkedTodos} setChecked={setCheckedTodos} />
          </div>
          <Button loading={isLoading} onClick={() => handleSubmit()}>
            Invite User
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AddUser;
