import logo from "@/assets/logo.png";
import {
  Phone,
  TicketCheck,
  CheckSquare,
  Mail,
  Users,
  LayoutTemplate,
  BookUser,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Kanban,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { invalidateCache } from "@/services/utilities/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomToggle } from "@/components/custom";
import GlobalSearch from "@/components/custom/GlobalSearch";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  handleDrawerToggle: () => void;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps) => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuth();

  const userName = user?.name ?? "";
  const userRole = user?.type ?? "";
  const isAdmin = userRole === "admin";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const logout = () => {
    clearUser();
    // Clear all cached API data so the next user starts fresh
    [
      "dashboard/stats",
      "users",
      "contacts",
      "tickets",
      "projects",
      "email-templates",
      "email-groups",
      "deals",
    ].forEach(invalidateCache);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={handleDrawerToggle}
        className="sm:hidden"
        aria-label="open menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <img src={logo} alt="Tiny CRM" className="h-7 w-auto rounded-md" />
      </div>

      {/* Global search */}
      <div className="flex-1 flex justify-center">
        <GlobalSearch />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <CustomToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md hover:bg-accent transition-colors text-foreground">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                {initials ? (
                  <span className="text-primary text-xs font-bold">
                    {initials}
                  </span>
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">
                {userName || "User"}
              </p>
            </div>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;

export interface NavItem {
  title: string;
  link: string;
  icon: React.ReactNode;
  permission: string;
  children?: Omit<NavItem, "children">[];
}

export const menuContents: NavItem[] = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    permission: "dashboard",
  },
  {
    title: "Contacts",
    link: "/dashboard/contacts",
    icon: <Phone className="h-4 w-4" />,
    permission: "contacts-view",
  },
  {
    title: "Pipeline",
    link: "/dashboard/pipeline",
    icon: <Kanban className="h-4 w-4" />,
    permission: "pipeline-view",
  },
  {
    title: "Tickets",
    link: "/dashboard/tickets",
    icon: <TicketCheck className="h-4 w-4" />,
    permission: "tickets-view",
  },
  {
    title: "Projects",
    link: "/dashboard/todos",
    icon: <CheckSquare className="h-4 w-4" />,
    permission: "projects-view",
  },
  {
    title: "Emails",
    link: "/dashboard/emails",
    icon: <Mail className="h-4 w-4" />,
    permission: "admin",
    children: [
      {
        title: "Templates",
        link: "/dashboard/emails/templates",
        icon: <LayoutTemplate className="h-4 w-4" />,
        permission: "admin",
      },
      {
        title: "Groups",
        link: "/dashboard/emails/groups",
        icon: <BookUser className="h-4 w-4" />,
        permission: "admin",
      },
    ],
  },
  {
    title: "Users",
    link: "/dashboard/users",
    icon: <Users className="h-4 w-4" />,
    permission: "users-view",
  },
];
