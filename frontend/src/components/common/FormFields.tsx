import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Labeled text/number/email input ───────────────────────────────────────

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}

export const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: FormFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={error ? "border-destructive" : undefined}
    />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ── Labeled select dropdown ────────────────────────────────────────────────

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: { val: string; label: string }[];
}

export const FormSelect = ({
  label,
  value,
  onChange,
  items,
}: FormSelectProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <Select value={value} onValueChange={onChange}>
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
