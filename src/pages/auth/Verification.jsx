import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
import AuthContainer from "../../layout/auth/AuthContainer";
import Img from "../../assets/illustrations/illustration-verification.jpg";
import MDButton from "../../components/MDButton";
import MDButtonLoading from "../../components/MDButtonLoading";

const Verification = () => {
  const [searchParams] = useSearchParams({});
  const [isLoading, setIsLoading] = useState(false);

  const resendVerification = () => {
    setIsLoading(true);
    const email = localStorage.getItem("CRM-email");
    apiAuth.post({ email: email }, "resend").then((res) => {
      if (res.status === "200") {
        toast.success("Verification Email is resent !");
        setIsLoading(false);
      } else {
        toast.error("Sending verification Email failed !");
        setIsLoading(false);
      }
    });
  };

  return (
    <AuthContainer
      title={
        searchParams.get("status") === "success"
          ? "First Step Towards Using Easy CRM"
          : searchParams.get("status") === "not-verified"
          ? "Not Verified"
          : "Wrong Link"
      }
      description={
        searchParams.get("status") === "success"
          ? "Thank you for signing up! You can now enjoy full access to our CRM's features after email verification. We will keep your email address safe and secure, using it solely to communicate with you about your account and our services."
          : searchParams.get("status") === "not-verified"
          ? "Please verify the email to access the features."
          : ""
      }
      illustration={Img}
    >
      {searchParams.get("status") === "success" ? (
        <section>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <MDButton variant="gradient" color="info" fullWidth sx={{ mt: 1 }}>
              Go back to Login
            </MDButton>
          </Link>
        </section>
      ) : searchParams.get("status") === "not-verified" ? (
        <section>
          <MDButtonLoading
            variant="gradient"
            color="info"
            fullWidth
            sx={{ mt: 1 }}
            onClick={resendVerification}
            loading={isLoading}
          >
            Resend Verification
          </MDButtonLoading>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <MDButton variant="gradient" color="light" fullWidth sx={{ mt: 1 }}>
              Go back to Login
            </MDButton>
          </Link>
        </section>
      ) : (
        <section>
          <Link to="/" style={{ textDecoration: "none" }}>
            <MDButton variant="gradient" color="info" fullWidth sx={{ mt: 1 }}>
              Go back home
            </MDButton>
          </Link>
        </section>
      )}
    </AuthContainer>
  );
};

export default Verification;
