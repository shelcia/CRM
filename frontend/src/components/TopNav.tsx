import React from "react";
import { Github } from "lucide-react";
import CustomToggle from "@/components/CustomToggle";

const TopNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b flex items-center px-6 gap-3">
    <div className="flex items-center gap-2 flex-1">
      <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <span className="text-primary-foreground text-xs font-black">C</span>
      </div>
      <span className="font-bold text-foreground tracking-tight">Easy CRM</span>
    </div>

    <a
      href="https://github.com/shelcia/easy-crm"
      target="_blank"
      rel="noreferrer"
      className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      aria-label="GitHub"
    >
      <Github className="h-5 w-5" />
    </a>
    <CustomToggle />
  </nav>
);

export const TopNavFooter = () => (
  <footer className="fixed bottom-0 left-0 right-0 h-10 flex items-center justify-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur">
    Developed by{" "}
    <a
      href="https://shelcia-dev.me/"
      target="_blank"
      rel="noreferrer"
      className="ml-1 text-primary hover:underline font-medium"
    >
      Shelcia
    </a>
  </footer>
);

export default TopNav;
