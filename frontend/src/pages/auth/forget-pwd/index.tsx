import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/custom";
import { AuthHeader } from "@/components/common";
import { apiAuth } from "@/services/models/authModel";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
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
      <AuthHeader title="Forgot Password" description="Enter your email and we'll send you a reset link" />

      <div className="flex flex-col gap-4">
        <CustomTextField
          name="email"
          label="Email"
          type="email"
          placeholder="james@company.com"
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
          Send Reset Link
        </Button>
      </div>

      <p className="text-sm text-center text-muted-foreground">
        Remembered?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Back to login
        </Link>
      </p>
    </>
  );
};

export default ForgetPassword;
