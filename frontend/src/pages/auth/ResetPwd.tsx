import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CustomAuthInput } from "@/components/CustomInputs";
import { apiAuth } from "@/services/models/authModel";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ResetPwd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Minimum 6 characters required").required("Password is required"),
      confirmPassword: Yup.string()
        .min(6, "Minimum 6 characters required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiAuth.put({ password: values.password }, `change-password/${id}`).then((res) => {
        if (res.status === "200") {
          toast.success("Successfully reset");
          navigate("/login");
        } else {
          toast.error(res.status === "400" ? res.message : "Error");
        }
        setIsLoading(false);
      });
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <CustomAuthInput name="password" placeholder="enter new password" values={values} handleChange={handleChange} touched={touched} errors={errors} type="password" />
      <CustomAuthInput name="confirmPassword" placeholder="confirm password" values={values} handleChange={handleChange} touched={touched} errors={errors} type="password" />
      <Button className="w-full mt-1" loading={isLoading} onClick={() => handleSubmit()}>
        Reset Password
      </Button>
    </>
  );
};

export default ResetPwd;
