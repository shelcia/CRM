import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiEmailInputProps {
  value: string; // comma-separated emails
  onChange: (value: string) => void;
  className?: string;
  hasError?: boolean;
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const MultiEmailInput = ({
  value,
  onChange,
  className,
  hasError,
}: MultiEmailInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const emails = value
    ? value.split(",").map((e) => e.trim()).filter(Boolean)
    : [];

  const addEmail = (raw: string) => {
    const email = raw.trim();
    if (!email) return;
    if (!isValidEmail(email)) return;
    if (emails.includes(email)) {
      setInput("");
      return;
    }
    onChange([...emails, email].join(", "));
    setInput("");
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e !== email).join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addEmail(input);
    } else if (e.key === "Backspace" && !input && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handleBlur = () => {
    if (input) addEmail(input);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    const valid = parts.filter(isValidEmail);
    const newEmails = [...new Set([...emails, ...valid])];
    onChange(newEmails.join(", "));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm cursor-text focus-within:ring-1 focus-within:ring-ring transition-colors",
        hasError && "border-destructive focus-within:ring-destructive",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {emails.map((email) => (
        <span
          key={email}
          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs font-medium"
        >
          {email}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeEmail(email);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={emails.length === 0 ? "user@company.com" : ""}
        className="flex-1 min-w-[140px] bg-transparent outline-none text-xs placeholder:text-muted-foreground"
      />
    </div>
  );
};
