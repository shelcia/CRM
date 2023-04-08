import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, Button } from "@mui/material";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";

const Verification = () => {
  const [searchParams] = useSearchParams({});

  const resendVerification = () => {
    const email = localStorage.getItem("CRM-email");
    apiAuth.post({ email: email }, "resend").then((res) => {
      if (res.status === "200") {
        toast.success("Verification Email is resent !");
      } else {
        toast.error("Sending verification Email failed !");
      }
    });
  };

  return searchParams.get("status") === "success" ? (
    <section>
      <Alert severity="success">
        <AlertTitle>First Step Towards Using Easy CRM</AlertTitle>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Thank you for signing up! You can now enjoy full access to our CRM's
        features. We will keep your email address safe and secure and will only
        use it to communicate with you about your account and our services.
      </Alert>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Go back to Login
        </Button>
      </Link>
    </section>
  ) : searchParams.get("status") === "not-verified" ? (
    <section>
      <Alert severity="error">
        <AlertTitle>Not Verified</AlertTitle>
        Please verify the email to access the features.
      </Alert>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={resendVerification}
      >
        Resend Verification
      </Button>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Go back to Login
        </Button>
      </Link>
    </section>
  ) : (
    <section>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Go back home
        </Button>
      </Link>
    </section>
  );
};

export default Verification;
