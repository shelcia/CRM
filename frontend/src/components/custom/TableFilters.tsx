import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toLabel } from "@/utils";

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

interface TableFiltersProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export const TableFilters = ({
  filters,
  values,
  onChange,
}: TableFiltersProps) => (
  <div className="flex flex-wrap gap-2">
    {filters.map((f) => (
      <Select
        key={f.key}
        value={values[f.key] || "all"}
        onValueChange={(v) => onChange(f.key, v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-8 text-xs w-36">
          <SelectValue placeholder={`All ${f.label}s`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {f.label}s</SelectItem>
          {f.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {toLabel(opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ))}
  </div>
);
