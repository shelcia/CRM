import { CustomToggle } from "@/components/custom";
import { Github } from "lucide-react";
import logo from "@/assets/logo.png";

const Topbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b flex items-center px-6 gap-3">
    <div className="flex items-center gap-2 flex-1">
      <div className="flex items-center gap-2 shrink-0">
        <img src={logo} alt="Tiny CRM" className="h-7 w-auto" />
      </div>
      <span className="font-bold text-foreground tracking-tight">Tiny CRM</span>
    </div>

    <a
      href="https://github.com/shelcia/easy-crm"
      target="_blank"
      rel="noreferrer"
      className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      aria-label="GitHub"
    >
      <Github className="size-5" strokeWidth={2.5} />
    </a>
    <CustomToggle />
  </nav>
);

export default Topbar;
