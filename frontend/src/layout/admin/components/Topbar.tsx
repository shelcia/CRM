import React from "react";
import {
  Phone,
  TicketCheck,
  CheckSquare,
  Mail,
  FileText,
  Users,
  Menu,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomToggle from "@/components/CustomToggle";

interface TopbarProps {
  handleDrawerToggle: () => void;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={handleDrawerToggle}
        className="sm:hidden p-1.5 rounded-md hover:bg-accent transition-colors text-foreground"
        aria-label="open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-black">C</span>
        </div>
        <span className="font-bold text-foreground tracking-tight hidden sm:block">
          Easy CRM
        </span>
      </div>

      {/* Nav links — desktop */}
      <nav className="hidden sm:flex flex-1 items-center gap-0.5">
        {menuContents.map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`
            }
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <CustomToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md hover:bg-accent transition-colors text-foreground">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;

export const menuContents = [
  {
    title: "Users",
    link: "/dashboard/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Contacts",
    link: "/dashboard/contacts",
    icon: <Phone className="h-4 w-4" />,
  },
  {
    title: "Tickets",
    link: "/dashboard/tickets",
    icon: <TicketCheck className="h-4 w-4" />,
  },
  {
    title: "Todos",
    link: "/dashboard/todos",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    title: "Email",
    link: "/dashboard/emails",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    title: "CDA",
    link: "/dashboard/cda",
    icon: <FileText className="h-4 w-4" />,
  },
];
