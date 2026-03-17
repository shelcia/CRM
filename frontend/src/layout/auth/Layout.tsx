import React from "react";
import TopNav, { TopNavFooter } from "@/components/TopNav";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="flex items-center justify-center min-h-screen pt-14 pb-10 px-4">
        <div className="w-full max-w-[425px] rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col gap-3">
            {children}
          </div>
        </div>
      </div>

      <TopNavFooter />
    </div>
  );
};

export default AuthLayout;
