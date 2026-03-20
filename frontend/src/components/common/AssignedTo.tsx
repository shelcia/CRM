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
}

export const AssignedToSelect = ({
  value,
  onChange,
  triggerClassName,
}: SelectProps) => {
  const { userItems } = useUsers();
  return (
    <Select
      value={value || "__none__"}
      onValueChange={(v) => onChange(v === "__none__" ? "" : v)}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder="Unassigned" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">Unassigned</SelectItem>
        {userItems.map((u) => (
          <SelectItem key={u.val} value={u.val}>
            {u.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
