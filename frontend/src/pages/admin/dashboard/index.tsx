import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Phone,
  TicketCheck,
  CheckSquare,
  Clock,
  PhoneCall,
} from "lucide-react";
import { apiProvider } from "@/services/utilities/provider";
import {
  StatusBadge,
  PriorityIndicator,
  CustomEmptyState,
  PageHeader,
} from "@/components/custom";
import { convertDateToDateWithoutTime, getTimeOfDay } from "@/utils";
import { Link } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import type { LucideIcon } from "lucide-react";
import { DashboardStats, Metric } from "./types";
import MetricCard from "./components/MetricCard";

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
      icon: <Phone className="size-5 text-primary" />,
      href: "/dashboard/contacts",
      color: "bg-primary/10",
      permission: "contacts-view",
    },
    {
      label: "Open Tickets",
      value: loading ? "—" : (stats?.openTickets ?? 0),
      icon: <TicketCheck className="size-5 text-red-500" />,
      href: "/dashboard/tickets",
      color: "bg-red-500/10",
      permission: "tickets-view",
    },
    {
      label: "Total Projects",
      value: loading ? "—" : (stats?.totalProjects ?? 0),
      icon: <CheckSquare className="size-5 text-amber-500" />,
      href: "/dashboard/todos",
      color: "bg-amber-500/10",
      permission: "todos-view",
    },
    {
      label: "Team Members",
      value: loading ? "—" : (stats?.totalUsers ?? 0),
      icon: <Users className="size-5 text-purple-500" />,
      href: "/dashboard/users",
      color: "bg-purple-500/10",
      permission: "users-view",
    },
  ];

  const visibleMetrics = metrics.filter((m) => has(m.permission));

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <PageHeader
        title={`Good ${getTimeOfDay()}, ${name.split(" ")?.[0]} 👋`}
        description="Here's what's happening in your CRM today"
      />

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
        {has("contacts-view") && (
          <RecentCard
            title="Recent Contacts"
            icon={<PhoneCall className="size-4 text-primary" />}
            viewAllHref="/dashboard/contacts"
            loading={loading}
            emptyIcon={Users}
            emptyTitle="No contacts yet"
            emptyAction={
              <Link
                to="/dashboard/contacts/add-contact"
                className="text-xs text-primary hover:underline"
              >
                Add one
              </Link>
            }
            items={stats?.recentContacts ?? []}
            renderItem={(c) => (
              <li
                key={c._id}
                className="py-2.5 flex items-center justify-between gap-3"
              >
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
            )}
          />
        )}

        {has("tickets-view") && (
          <RecentCard
            title="Recent Tickets"
            icon={<Clock className="h-4 w-4 text-primary" />}
            viewAllHref="/dashboard/tickets"
            loading={loading}
            emptyIcon={TicketCheck}
            emptyTitle="No tickets yet"
            emptyAction={
              <Link
                to="/dashboard/tickets/add-ticket"
                className="text-xs text-primary hover:underline"
              >
                Create one
              </Link>
            }
            items={stats?.recentTickets ?? []}
            renderItem={(t) => (
              <li
                key={t._id}
                className="py-2.5 flex items-center justify-between gap-3"
              >
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
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

interface RecentCardProps<T> {
  title: string;
  icon: React.ReactNode;
  viewAllHref: string;
  loading: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyAction?: React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const RecentCard = <T extends { _id: string }>({
  title,
  icon,
  viewAllHref,
  loading,
  emptyIcon,
  emptyTitle,
  emptyAction,
  items,
  renderItem,
}: RecentCardProps<T>) => (
  <Card>
    <div className="flex items-center justify-between px-5 py-4 border-b">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <Link to={viewAllHref} className="text-xs text-primary hover:underline">
        View all
      </Link>
    </div>
    <CardContent className="pt-4 pb-2">
      {loading ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Loading…
        </p>
      ) : !items.length ? (
        <CustomEmptyState
          compact
          icon={emptyIcon}
          title={emptyTitle}
          className="py-8"
          action={emptyAction}
        />
      ) : (
        <ul className="divide-y">{items.map(renderItem)}</ul>
      )}
    </CardContent>
  </Card>
);
