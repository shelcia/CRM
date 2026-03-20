import React from "react";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import AuthCard from "@/components/common/AuthCard";

interface PublicLayoutProps {
  children: React.ReactNode;
  card?: boolean;
}

const PublicLayout = ({ children, card = false }: PublicLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Topbar />

    <div className="flex items-center justify-center min-h-screen pt-14 pb-10 px-4">
      {card ? <AuthCard>{children}</AuthCard> : children}
    </div>

    <Footer />
  </div>
);

export default PublicLayout;
