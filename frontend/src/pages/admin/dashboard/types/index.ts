export interface DashboardStats {
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

export interface Metric {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  color: string;
  permission: string;
}
