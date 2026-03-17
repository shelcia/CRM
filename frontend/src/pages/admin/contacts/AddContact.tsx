import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import CustomModal from "@/components/CustomModal";
import { CustomSelectField, CustomTextField } from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { apiContacts } from "@/services/models/contactsModel";

const AddContact = ({
  open,
  setOpen,
  onAdded,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAdded?: (contact: object) => void;
}) => {
  const { errors, values, handleChange, handleSubmit, touched, resetForm } = useFormik({
    initialValues: {
      name: "", email: "", number: "", company: "", contactOwner: "",
      priority: "low", companySize: 50, jobTitle: "", expectedRevenue: 10000,
      probability: "0.5", status: "new", lastActivity: new Date().toISOString(),
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Contact name is Required!"),
      email: Yup.string().email("Enter valid email!"),
      number: Yup.string(),
      company: Yup.string(),
      priority: Yup.string(),
      companySize: Yup.number().min(0),
      jobTitle: Yup.string(),
      expectedRevenue: Yup.number(),
      probability: Yup.string(),
      status: Yup.string().required("enter valid status"),
    }),
    onSubmit: (values) => {
      apiContacts.post!(values, "", true).then((res) => {
        if (res && res._id) {
          toast.success("Contact added successfully");
          onAdded?.(res);
          resetForm();
        } else {
          toast.error(res?.message ?? "Failed to add contact");
        }
      });
    },
  });

  const onClose = () => setOpen(false);

  return (
    <CustomModal open={open} onClose={onClose} title="Add Contact">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <CustomTextField name="name" placeholder="name" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomTextField name="email" placeholder="enter email ex: romeo@gmail.com" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomTextField name="number" placeholder="number" values={values} handleChange={handleChange} touched={touched} errors={errors} type="number" />
        <CustomTextField name="company" placeholder="company" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomSelectField
          name="priority"
          placeholder="priority"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
          labelItms={[
            { val: "low", label: "Low" },
            { val: "medium", label: "Medium" },
            { val: "high", label: "High" },
            { val: "veryHigh", label: "Very High" },
          ]}
        />
        <CustomTextField name="companySize" placeholder="companySize" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomTextField name="jobTitle" placeholder="jobTitle" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomTextField name="probability" placeholder="probability" values={values} handleChange={handleChange} touched={touched} errors={errors} />
        <CustomSelectField
          name="status"
          placeholder="status"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
          labelItms={[
            { val: "new", label: "New" }, { val: "open", label: "Open" },
            { val: "inProgress", label: "In Progress" }, { val: "openDeal", label: "Open Deal" },
            { val: "unqualified", label: "Unqualified" }, { val: "badTiming", label: "Bad Timing" },
            { val: "attempted", label: "Attempted to Connect" }, { val: "connected", label: "Connected" },
            { val: "closed", label: "Closed" },
          ]}
        />
        <div className="flex justify-end gap-3 mt-2">
          <Button type="submit" onClick={() => handleSubmit()}>Add</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddContact;
