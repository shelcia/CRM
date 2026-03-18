import React from "react";
import logo from "@/assets/logo.png";
import {
  Phone,
  TicketCheck,
  CheckSquare,
  Mail,
  Users,
  Menu,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const userName = localStorage.getItem("CRM-name") ?? "";
  const userRole = localStorage.getItem("CRM-type") ?? "";
  const isAdmin = userRole === "admin";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
        <img src={logo} alt="Tiny CRM" className="h-7 w-auto" />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <CustomToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md hover:bg-accent transition-colors text-foreground">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                {initials ? (
                  <span className="text-primary text-xs font-bold">{initials}</span>
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{userName || "User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
            )}
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
    title: "Projects",
    link: "/dashboard/todos",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    title: "Email",
    link: "/dashboard/emails",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    title: "Users",
    link: "/dashboard/users",
    icon: <Users className="h-4 w-4" />,
  },
];
