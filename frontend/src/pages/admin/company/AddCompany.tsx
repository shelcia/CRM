import React, { useState } from "react";
import { CustomTextField } from "@/components/CustomInputs";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiCompany } from "@/services/models/companyModel";

const AddCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { name: "", website: "", number: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      website: Yup.string(),
      number: Yup.string(),
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
    <>
      <h1 className="text-3xl font-bold">Add Company</h1>
      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 p-4">
              <CustomTextField
                name="name"
                label="Name"
                placeholder="enter name"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomTextField
                name="website"
                label="Website"
                placeholder="enter website"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <CustomTextField
                name="number"
                label="Phone Number"
                placeholder="enter number"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading ? "Creating..." : "Add Company"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddCompany;
