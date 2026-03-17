import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "@/components/CustomInputs";
import { apiAuth } from "@/services/models/authModel";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Enter valid email!").required("Email is required !"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiAuth.post(values, "reset-password").then((res) => {
        if (res.status === "200") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        setIsLoading(false);
      });
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <CustomAuthInput
        name="email"
        placeholder="ex: james@company.com"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <Button className="w-full mt-1" loading={isLoading} onClick={() => handleSubmit()}>
        Reset Password
      </Button>
    </>
  );
};

export default ForgetPassword;
