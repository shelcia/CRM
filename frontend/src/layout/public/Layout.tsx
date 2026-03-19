import React from "react";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
  card?: boolean;
}

const PublicLayout = ({ children, card = false }: PublicLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Topbar />

    <div className="flex items-center justify-center min-h-screen pt-14 pb-10 px-4">
      {card ? (
        <div className="w-full max-w-[425px] rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col gap-3">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>

    <Footer />
  </div>
);

export default PublicLayout;
