export interface ITicket {
  _id: string;
  title: string;
  contact: string;
  email?: string;
  category?: string;
  priority: string;
  status: string;
  assignedTo?: string;
  description?: string;
  createdAt: string;
}
