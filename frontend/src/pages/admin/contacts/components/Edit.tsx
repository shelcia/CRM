import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils";
import { FormField, FormSelect } from "@/components/common";

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

interface EditProps {
  form: EditForm;
  set: (field: keyof EditForm, value: string) => void;
}

const Edit = ({ form, set }: EditProps) => {
  const { contactStatuses, contactPriorities } = useEnums();

  return (
    <div className="flex flex-col gap-3">
      <FormField
        label="Full Name"
        value={form.name}
        onChange={(v) => set("name", v)}
      />
      <FormField
        label="Email"
        value={form.email}
        onChange={(v) => set("email", v)}
        type="email"
      />
      <FormField
        label="Phone"
        value={form.number}
        onChange={(v) => set("number", v)}
      />
      <FormField
        label="Company"
        value={form.company}
        onChange={(v) => set("company", v)}
      />
      <FormField
        label="Job Title"
        value={form.jobTitle}
        onChange={(v) => set("jobTitle", v)}
      />
      <FormField
        label="Company Size"
        value={form.companySize}
        onChange={(v) => set("companySize", v)}
        type="number"
      />
      <FormField
        label="Probability (0–1)"
        value={form.probability}
        onChange={(v) => set("probability", v)}
      />
      <FormSelect
        label="Status"
        value={form.status}
        onChange={(v) => set("status", v)}
        items={toLabelItems(contactStatuses)}
      />
      <FormSelect
        label="Priority"
        value={form.priority}
        onChange={(v) => set("priority", v)}
        items={toLabelItems(contactPriorities)}
      />
    </div>
  );
};

export default Edit;
