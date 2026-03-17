import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-md">
        {/* Icon */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <SearchX className="w-14 h-14 text-primary" strokeWidth={1.5} />
          </div>
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            404
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            Double-check the URL or head back home.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-border" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
          <Button onClick={() => navigate("/")}>Take me home</Button>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
