import { Users, TicketCheck, Phone, Mail } from "lucide-react";

export const FEATURES = [
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "User Management",
    description:
      "Invite team members, assign roles and control permissions with ease.",
  },
  {
    icon: <Phone className="h-5 w-5 text-primary" />,
    title: "Contact Tracking",
    description:
      "Keep all your leads and contacts organised with activity history.",
  },
  {
    icon: <TicketCheck className="h-5 w-5 text-primary" />,
    title: "Support Tickets",
    description: "Manage customer tickets and resolve issues faster as a team.",
  },
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    title: "Email Templates",
    description: "Create and send polished emails directly from your CRM.",
  },
];

export const HIGHLIGHTS = [
  "Open source & free forever",
  "Dark mode included",
  "Drag-and-drop Kanban boards",
  "CSV export on every table",
];
