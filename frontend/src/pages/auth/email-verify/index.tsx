import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAuth } from "@/services/models/authModel";
import { Button } from "@/components/ui/button";

const EmailVerify = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res) => {
      if (res.status === "200") {
        setSuccess(true);
        setMessage("Verified Successfully");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setSuccess(false);
        setMessage("Verification Failed");
      }
    });
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card shadow-sm p-6 flex flex-col gap-3">
        <p
          className={`text-center rounded px-4 py-2 text-white font-medium ${
            success ? "bg-[#2CC5BD]" : "bg-[#FD396D]"
          }`}
        >
          {message || "Verifying..."}
        </p>
        <Link to="/">
          <Button className="w-full">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerify;
