export interface IDeal {
  _id: string;
  title: string;
  contactId?: string;
  contactName?: string;
  value: number;
  currency: string;
  stage: string;
  assignedTo?: string;
  expectedClose?: string;
  createdAt: string;
}
