import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiAuth } from "@/services/models/authModel";
import { toast } from "react-hot-toast";
import { MailCheck, MailWarning } from "lucide-react";

const Verification = () => {
  const [searchParams] = useSearchParams({});
  const [isLoading, setIsLoading] = useState(false);

  const resendVerification = () => {
    setIsLoading(true);
    const email = localStorage.getItem("CRM-email");
    apiAuth.post({ email }, "resend").then((res) => {
      if (res.status === "200") {
        toast.success("Verification email resent");
      } else {
        toast.error("Failed to resend verification email");
      }
      setIsLoading(false);
    });
  };

  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <MailCheck className="h-8 w-8 text-primary" />
          <p className="text-sm font-semibold">Check your inbox</p>
          <p className="text-xs text-muted-foreground">
            Verify your email to get full access to Tiny CRM.
          </p>
        </div>
        <Link to="/login">
          <Button className="w-full">Go to Login</Button>
        </Link>
      </section>
    );
  }

  if (status === "not-verified") {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <MailWarning className="h-8 w-8 text-destructive" />
          <p className="text-sm font-semibold">Email not verified</p>
          <p className="text-xs text-muted-foreground">
            Please verify your email to access all features.
          </p>
        </div>
        <Button className="w-full" loading={isLoading} onClick={resendVerification}>
          Resend Verification Email
        </Button>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Back to Login
          </Button>
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
