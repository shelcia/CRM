import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAuth } from "@/services/models/authModel";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const EmailVerify = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res) => {
      if (res.status === "200") {
        setSuccess(true);
        setMessage("Email verified successfully");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setSuccess(false);
        setMessage("Verification failed");
      }
    });
  }, [id, navigate]);

  return (
    <>
      <div className="flex flex-col items-center gap-2 py-2">
        {!message ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : success ? (
          <CheckCircle2 className="h-10 w-10 text-primary" />
        ) : (
          <XCircle className="h-10 w-10 text-destructive" />
        )}
        <p className="text-sm font-medium text-center">
          {message || "Verifying your email…"}
        </p>
        {success && (
          <p className="text-xs text-muted-foreground text-center">
            Redirecting to home in 3 seconds…
          </p>
        )}
      </div>
      <Link to="/">
        <Button className="w-full" variant={success ? "default" : "outline"}>
          Go to Home
        </Button>
      </Link>
    </>
  );
};

export default EmailVerify;
