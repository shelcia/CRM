import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { apiAuth } from "@/services/models/authModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Info } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required !"),
    company: Yup.string().required("Company name is required !"),
    email: Yup.string().email("Enter valid email!").required("Email is required !"),
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
      <div className="flex flex-col gap-1 mb-1">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Set up your Easy CRM workspace</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-primary">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          To join as an employee or co-admin, ask your admin to send you an invitation email instead.
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="James Smith"
            value={values.name}
            onChange={handleChange}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            name="company"
            placeholder="Acme Inc."
            value={values.cname}
            onChange={handleChange}
            error={Boolean(touched.company && errors.company)}
            helperText={touched.company && errors.company}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="james@acme.com"
            value={values.email}
            onChange={handleChange}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button className="w-full" disabled={isLoading} onClick={() => handleSubmit()}>
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
