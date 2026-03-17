import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { CustomSelectField, CustomTextField, CustomTextAreaField } from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Ticket, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiTickets } from "@/services/models/ticketsModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";

const AddTicket = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { ticketStatuses, ticketPriorities } = useEnums();

  const { errors, values, handleChange, handleSubmit, touched, resetForm } = useFormik({
    initialValues: {
      title: "",
      contact: "",
      email: "",
      category: "technical",
      priority: "medium",
      status: "open",
      assignedTo: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Ticket title is required"),
      contact: Yup.string().required("Contact name is required"),
      email: Yup.string().email("Enter a valid email"),
      category: Yup.string().required("Category is required"),
      priority: Yup.string().required("Priority is required"),
      status: Yup.string().required("Status is required"),
      assignedTo: Yup.string(),
      description: Yup.string(),
    }),
    onSubmit: (vals) => {
      setIsLoading(true);
      apiTickets.post!(vals, "", true).then((res) => {
        if (res && res._id) {
          toast.success("Ticket created successfully");
          resetForm();
          navigate("/dashboard/tickets");
        } else {
          toast.error(res?.message ?? "Failed to create ticket");
        }
        setIsLoading(false);
      });
    },
  });

  return (
    <section className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard/tickets">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Ticket</h1>
          <p className="text-sm text-muted-foreground">Log a new support or issue ticket</p>
        </div>
      </div>

      {/* Ticket Info Card */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <Ticket className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Ticket Information</span>
        </div>
        <CardContent className="pt-6 space-y-4">
          <CustomTextField
            label="Ticket Title"
            name="title"
            placeholder="ex: Login page throws 500 error"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomTextField
              label="Contact Name"
              name="contact"
              placeholder="ex: Jane Smith"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Contact Email"
              name="email"
              placeholder="ex: jane@company.com"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </div>
          <CustomTextAreaField
            name="description"
            placeholder="Describe the issue in detail..."
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Ticket Details</span>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelectField
              label="Category"
              name="category"
              placeholder="category"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={[
                { val: "technical", label: "Technical" },
                { val: "billing", label: "Billing" },
                { val: "general", label: "General" },
                { val: "featureRequest", label: "Feature Request" },
                { val: "bug", label: "Bug" },
                { val: "other", label: "Other" },
              ]}
            />
            <CustomSelectField
              label="Priority"
              name="priority"
              placeholder="priority"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={toLabelItems(ticketPriorities)}
            />
            <CustomSelectField
              label="Status"
              name="status"
              placeholder="status"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={toLabelItems(ticketStatuses)}
            />
            <CustomTextField
              label="Assigned To"
              name="assignedTo"
              placeholder="ex: Alice"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link to="/dashboard/tickets">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button loading={isLoading} onClick={() => handleSubmit()}>
          Create Ticket
        </Button>
      </div>
    </section>
  );
};

export default AddTicket;
