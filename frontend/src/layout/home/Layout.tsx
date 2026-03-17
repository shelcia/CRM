import React from "react";
import TopNav, { TopNavFooter } from "@/components/TopNav";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="flex items-center justify-center min-h-screen pt-14 pb-10">
        {children}
      </div>

      <TopNavFooter />
    </div>
  );
};

export default HomeLayout;
