import {
  ActivityIcon,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Activity } from "react";
import { NoteType } from "../types";

export const PAGE_SIZE = 50;

export const CSV_TEMPLATE =
  "name,email,number,company,jobTitle,priority,companySize,probability,status\nJane Smith,jane@acme.com,+15550001234,Acme Corp,Product Manager,high,250,0.7,new";

export const NOTE_TYPE_META: Record<
  NoteType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  note: {
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    label: "Note",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  call: {
    icon: <Phone className="h-3.5 w-3.5" />,
    label: "Call",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  email: {
    icon: <Mail className="h-3.5 w-3.5" />,
    label: "Email",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  meeting: {
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Meeting",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  activity: {
    icon: <ActivityIcon className="h-3.5 w-3.5" />,
    label: "Activity",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
};

export const NOTE_TYPES: NoteType[] = ["note", "call", "email", "meeting"];
