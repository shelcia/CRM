import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/custom";
import { AuthHeader } from "@/components/common";
import { apiAuth } from "@/services/models/authModel";

const ResetPwd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Minimum 6 characters required")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .min(6, "Minimum 6 characters required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      apiAuth
        .put({ password: values.password }, `change-password/${id}`)
        .then((res) => {
          if (res.status === "200") {
            toast.success("Password reset successfully");
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
      <AuthHeader title="Set New Password" description="Choose a strong password (min. 6 characters)" />

      <div className="flex flex-col gap-4">
        <CustomTextField
          name="password"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <CustomTextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <Button
          className="w-full"
          loading={isLoading}
          onClick={() => handleSubmit()}
        >
          Reset Password
        </Button>
      </div>

      <p className="text-sm text-center text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline font-medium">
          Back to login
        </Link>
      </p>
    </>
  );
};

export default ResetPwd;
