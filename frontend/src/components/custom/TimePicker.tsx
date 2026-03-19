import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: boolean;
}

const TimePicker = ({ value, onChange, className, error }: TimePickerProps) => (
  <Input
    type="time"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
      error && "border-destructive",
      className,
    )}
  />
);

export default TimePicker;
