import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle, Button } from "@mui/material";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

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

  return searchParams.get("status") === "success" ? (
    <section>
      <Alert severity="success">
        <AlertTitle>First Step Towards Using Easy CRM</AlertTitle>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Thank you for signing up! You can now enjoy full access to our CRM's
        features after email verification. We will keep your email address safe
        and secure, using it solely to communicate with you about your account
        and our services.
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
      <LoadingButton
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={resendVerification}
        loading={isLoading}
      >
        Resend Verification
      </LoadingButton>
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
