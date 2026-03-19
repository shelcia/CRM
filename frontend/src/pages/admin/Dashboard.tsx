import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Phone, TicketCheck, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { apiProvider } from "@/services/utilities/provider";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityIndicator } from "@/components/PriorityIndicator";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { Link } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

interface DashboardStats {
  totalContacts: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalProjects: number;
  totalUsers: number;
  recentContacts: any[];
  recentTickets: any[];
}

interface Metric {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  color: string;
  permission: string;
}

const MetricCard = ({ label, value, icon, href, color }: Omit<Metric, "permission">) => (
  <Link to={href}>
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="pt-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { has } = usePermissions();

  const name = localStorage.getItem("CRM-name") ?? "there";

  useEffect(() => {
    const ctrl = new AbortController();
    apiProvider.getAll("dashboard/stats", ctrl.signal, true).then((res) => {
      if (res && typeof res === "object" && "totalContacts" in res) {
        setStats(res as DashboardStats);
      }
      setLoading(false);
    });
    return () => ctrl.abort();
  }, []);

  const metrics: Metric[] = [
    {
      label: "Total Contacts",
      value: loading ? "—" : (stats?.totalContacts ?? 0),
      icon: <Phone className="h-5 w-5 text-primary" />,
      href: "/dashboard/contacts",
      color: "bg-primary/10",
      permission: "contacts-view",
    },
    {
      label: "Open Tickets",
      value: loading ? "—" : (stats?.openTickets ?? 0),
      icon: <TicketCheck className="h-5 w-5 text-red-500" />,
      href: "/dashboard/tickets",
      color: "bg-red-500/10",
      permission: "tickets-view",
    },
    {
      label: "Total Projects",
      value: loading ? "—" : (stats?.totalProjects ?? 0),
      icon: <CheckSquare className="h-5 w-5 text-amber-500" />,
      href: "/dashboard/todos",
      color: "bg-amber-500/10",
      permission: "todos-view",
    },
    {
      label: "Team Members",
      value: loading ? "—" : (stats?.totalUsers ?? 0),
      icon: <Users className="h-5 w-5 text-purple-500" />,
      href: "/dashboard/users",
      color: "bg-purple-500/10",
      permission: "users-view",
    },
  ];

  const visibleMetrics = metrics.filter((m) => has(m.permission));

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Good {getTimeOfDay()}, {name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening in your CRM today.
        </p>
      </div>

      {/* Metric cards */}
      {visibleMetrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleMetrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent contacts */}
        {has("contacts-view") && (
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Recent Contacts</span>
              </div>
              <Link to="/dashboard/contacts" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            <CardContent className="pt-4 pb-2">
              {loading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
              ) : !stats?.recentContacts?.length ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No contacts yet.{" "}
                  <Link to="/dashboard/contacts/add-contact" className="text-primary hover:underline">
                    Add one
                  </Link>
                </div>
              ) : (
                <ul className="divide-y">
                  {stats.recentContacts.map((c) => (
                    <li key={c._id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.company || c.email}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge value={c.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent tickets */}
        {has("tickets-view") && (
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Recent Tickets</span>
              </div>
              <Link to="/dashboard/tickets" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            <CardContent className="pt-4 pb-2">
              {loading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
              ) : !stats?.recentTickets?.length ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No tickets yet.{" "}
                  <Link to="/dashboard/tickets/add-ticket" className="text-primary hover:underline">
                    Create one
                  </Link>
                </div>
              ) : (
                <ul className="divide-y">
                  {stats.recentTickets.map((t) => (
                    <li key={t._id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {convertDateToDateWithoutTime(t.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <PriorityIndicator value={t.priority} showLabel={false} />
                        <StatusBadge value={t.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default Dashboard;
