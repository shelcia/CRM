import {
  Users,
  TicketCheck,
  Phone,
  CalendarClock,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";

export const FEATURES = [
  {
    icon: <Phone className="h-5 w-5 text-primary" />,
    title: "Contact Tracking",
    description:
      "Manage leads and customers with activity notes, CSV import/export, and server-side search and filters.",
  },
  {
    icon: <TicketCheck className="h-5 w-5 text-primary" />,
    title: "Support Tickets",
    description:
      "Track and resolve customer issues with priority, category, and status filters built into the table.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    title: "Deal Pipeline",
    description:
      "Visualise your sales funnel on a Kanban board and move deals through stages at a glance.",
  },
  {
    icon: <LayoutGrid className="h-5 w-5 text-primary" />,
    title: "Project Boards",
    description:
      "Drag-and-drop Kanban boards with custom columns, task cards, and team assignees.",
  },
  {
    icon: <CalendarClock className="h-5 w-5 text-primary" />,
    title: "Scheduled Emails",
    description:
      "Build email templates and schedule them — one-time, daily, weekly, or monthly — delivered automatically via SMTP.",
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "User Management",
    description:
      "Invite team members and control what each role (admin, manager, employee) can see and do.",
  },
];

export const HIGHLIGHTS = [
  "Open source & free forever",
  "Dark mode included",
  "Role-based permissions",
  "CSV import & export",
  "Scheduled email delivery",
];
