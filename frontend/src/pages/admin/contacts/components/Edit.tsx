import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils";

type EditForm = {
  name: string;
  email: string;
  number: string;
  company: string;
  jobTitle: string;
  companySize: string;
  probability: string;
  status: string;
  priority: string;
};

const Edit = ({
  form,
  set,
}: {
  form: EditForm;
  set: (field: keyof EditForm, value: string) => void;
}) => {
  const { contactStatuses, contactPriorities } = useEnums();

  const field = (label: string, key: keyof EditForm, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  const select = (
    label: string,
    key: keyof EditForm,
    items: { val: string; label: string }[],
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select value={form[key]} onValueChange={(v) => set(key, v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.val} value={i.val}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {field("Full Name", "name")}
      {field("Email", "email", "email")}
      {field("Phone", "number")}
      {field("Company", "company")}
      {field("Job Title", "jobTitle")}
      {field("Company Size", "companySize", "number")}
      {field("Probability (0–1)", "probability")}
      {select("Status", "status", toLabelItems(contactStatuses))}
      {select("Priority", "priority", toLabelItems(contactPriorities))}
    </div>
  );
};

export default Edit;
