import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { apiAuth } from "@/services/models/authModel";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/custom";
import { AuthHeader } from "@/components/common";
import { Info } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required !"),
    company: Yup.string().required("Company name is required !"),
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
    password: Yup.string().required("Password is required !"),
  });

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { name: "", company: "", email: "", password: "" },
    validationSchema,
    onSubmit: (values) => registerUser(values),
  });

  const registerUser = (user) => {
    if (errors.name || errors.company || errors.email || errors.password) {
      toast.error("Please fill all the fields correctly");
      return;
    }
    setIsLoading(true);
    apiAuth.post({ ...user, role: "admin" }, "register").then((res) => {
      if (res.status === "201") {
        navigate("/verification?status=success");
        setIsLoading(false);
      } else {
        toast.error(res.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <AuthHeader title="Create an account" description="Set up your Tiny CRM workspace" />

      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-primary">
        <Info className="size-4 mt-0.5 shrink-0" />
        <span>
          To join as an employee or co-admin, ask your admin to send you an
          invitation email instead.
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <CustomTextField
          name="name"
          label="Full name"
          placeholder="James Smith"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <CustomTextField
          name="company"
          label="Company name"
          placeholder="Acme Inc."
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <CustomTextField
          name="email"
          label="Email"
          type="email"
          placeholder="james@acme.com"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <CustomTextField
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />

        <Button
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSubmit()}
        >
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </div>

      <p className="text-sm text-center text-muted-foreground pt-1">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
};

export default Signup;
