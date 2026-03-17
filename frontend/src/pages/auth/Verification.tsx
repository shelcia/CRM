import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiAuth } from "@/services/models/authModel";
import { toast } from "react-hot-toast";

const Verification = () => {
  const [searchParams] = useSearchParams({});
  const [isLoading, setIsLoading] = useState(false);

  const resendVerification = () => {
    setIsLoading(true);
    const email = localStorage.getItem("CRM-email");
    apiAuth.post({ email }, "resend").then((res) => {
      if (res.status === "200") {
        toast.success("Verification Email is resent !");
      } else {
        toast.error("Sending verification Email failed !");
      }
      setIsLoading(false);
    });
  };

  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <section className="flex flex-col gap-3">
        <Alert severity="success">
          <AlertTitle>First Step Towards Using Easy CRM</AlertTitle>
          Thank you for signing up! You can now enjoy full access to our CRM&apos;s features
          after email verification.
        </Alert>
        <Link to="/login">
          <Button className="w-full">Go back to Login</Button>
        </Link>
      </section>
    );
  }

  if (status === "not-verified") {
    return (
      <section className="flex flex-col gap-3">
        <Alert severity="error">
          <AlertTitle>Not Verified</AlertTitle>
          Please verify the email to access the features.
        </Alert>
        <Button className="w-full" loading={isLoading} onClick={resendVerification}>
          Resend Verification
        </Button>
        <Link to="/login">
          <Button variant="outline" className="w-full">Go back to Login</Button>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/">
        <Button className="w-full">Go back home</Button>
      </Link>
    </section>
  );
};

export default Verification;
