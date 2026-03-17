import React, { useState } from "react";
import { CustomTextField } from "@/components/CustomInputs";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Phone, Mail, Users, MapPin } from "lucide-react";
import { apiCompany } from "@/services/models/companyModel";

const AddCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      name: "",
      website: "",
      number: "",
      cmail: "",
      address: "",
      companySize: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Company name is required"),
      website: Yup.string(),
      number: Yup.string(),
      cmail: Yup.string().email("Enter a valid email"),
      address: Yup.string(),
      companySize: Yup.string(),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiCompany.post!(values, "", true).then((res) => {
        if (res && res._id) {
          toast.success("Company created successfully");
          localStorage.setItem("CRM-companyId", res._id);
          localStorage.setItem("CRM-company", res.name);
          navigate("/dashboard/contacts");
        } else {
          toast.error(res?.message ?? "Failed to create company");
        }
        setIsLoading(false);
      });
    },
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-1">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Set up your workspace</h1>
          <p className="text-sm text-muted-foreground">
            Tell us about your company to get started with Easy CRM
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">

          {/* Required */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Required
            </p>
            <CustomTextField
              name="name"
              label="Company Name"
              placeholder="ex: Acme Corp"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="border-t" />

          {/* Optional details */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Optional details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start">
                <Globe className="h-4 w-4 text-muted-foreground mt-8 shrink-0" />
                <div className="flex-1">
                  <CustomTextField
                    name="website"
                    label="Website"
                    placeholder="https://company.com"
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <Phone className="h-4 w-4 text-muted-foreground mt-8 shrink-0" />
                <div className="flex-1">
                  <CustomTextField
                    name="number"
                    label="Phone Number"
                    placeholder="+1 555 000 0000"
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <Mail className="h-4 w-4 text-muted-foreground mt-8 shrink-0" />
                <div className="flex-1">
                  <CustomTextField
                    name="cmail"
                    label="Company Email"
                    placeholder="hello@company.com"
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <Users className="h-4 w-4 text-muted-foreground mt-8 shrink-0" />
                <div className="flex-1">
                  <CustomTextField
                    name="companySize"
                    label="Company Size"
                    placeholder="ex: 50"
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <MapPin className="h-4 w-4 text-muted-foreground mt-8 shrink-0" />
              <div className="flex-1">
                <CustomTextField
                  name="address"
                  label="Address"
                  placeholder="123 Main St, City, Country"
                  values={values}
                  handleChange={handleChange}
                  touched={touched}
                  errors={errors}
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            loading={isLoading}
            onClick={() => handleSubmit()}
          >
            Create Workspace
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You can update these details later from your company profile
        </p>
      </div>
    </div>
  );
};

export default AddCompany;
