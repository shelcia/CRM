import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/custom";
import { apiAuth } from "@/services/models/authModel";

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
    password: Yup.string().required("Password is required !"),
  });

  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => loginUser(values),
  });

  const loginUser = (user) => {
    apiAuth.post(user, "login").then((res) => {
      if (res.status === "200") {
        localStorage.setItem("CRM-id", res.message.id);
        localStorage.setItem("CRM-name", res.message.name);
        localStorage.setItem("CRM-email", res.message.email);
        localStorage.setItem("CRM-type", res.message.type);
        localStorage.setItem("CRM-token", res.message.token);
        localStorage.setItem("CRM-companyId", res.message.companyId);
        localStorage.setItem("CRM-company", res.message.company);
        localStorage.setItem("CRM-permissions", JSON.stringify(res.message.permissions ?? []));
        if (res.message.companyId) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/add-company");
        }
      } else if (res.status === "401") {
        localStorage.setItem("CRM-email", user.email);
        navigate("/verification?status=not-verified");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Tiny CRM account
        </p>
      </div>

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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Password</span>
            <Link
              to="/forget-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <CustomTextField
            name="password"
            type="password"
            placeholder="Enter your password"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
        </div>

        <Button className="w-full" onClick={() => handleSubmit()}>
          Sign in
        </Button>
      </div>

      <p className="text-sm text-center text-muted-foreground pt-1">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
