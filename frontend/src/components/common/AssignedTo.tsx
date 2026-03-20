import useUsers from "@/hooks/useUsers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthorAvatar from "./AuthorAvatar";

// ── Display (read-only) ────────────────────────────────────────────────────

interface DisplayProps {
  name?: string;
  avatarClassName?: string;
}

export const AssignedToDisplay = ({ name, avatarClassName }: DisplayProps) => {
  if (!name) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      <AuthorAvatar name={name} className={avatarClassName} />
      <span className="text-sm truncate">{name}</span>
    </div>
  );
};

// ── Select (form input) ────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  triggerClassName?: string;
  allOption?: string;
}

export const AssignedToSelect = ({
  value,
  onChange,
  triggerClassName,
  allOption,
}: SelectProps) => {
  const { userItems } = useUsers();
  const resolvedValue = allOption ? value : value || "__none__";
  const handleChange = allOption
    ? onChange
    : (v: string) => onChange(v === "__none__" ? "" : v);
  return (
    <Select value={resolvedValue} onValueChange={handleChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={allOption ?? "Unassigned"} />
      </SelectTrigger>
      <SelectContent>
        {allOption ? (
          <SelectItem value="all">{allOption}</SelectItem>
        ) : (
          <SelectItem value="__none__">Unassigned</SelectItem>
        )}
        {userItems.map((u) => (
          <SelectItem key={u.val} value={u.val}>
            {u.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
