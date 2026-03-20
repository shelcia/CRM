import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { apiProvider } from "@/services/utilities/provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
}

interface ContactSelectProps {
  /** Currently selected contact name (for display) */
  value: string;
  onChange: (name: string, id: string, email: string) => void;
  placeholder?: string;
  triggerClassName?: string;
}

export const ContactSelect = ({
  value,
  onChange,
  placeholder = "Select contact…",
  triggerClassName,
}: ContactSelectProps) => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const sig = new AbortController().signal;
    apiProvider.getAll("contacts", sig, true).then((res: any) => {
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list)) setContacts(list);
    });
  }, []);

  const handleSelect = (contact: Contact) => {
    onChange(contact.name, contact._id, contact.email);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            triggerClassName,
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search contacts…" />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup>
              {contacts.map((c) => (
                <CommandItem
                  key={c._id}
                  value={`${c.name} ${c.email}`}
                  onSelect={() => handleSelect(c)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === c.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    {c.email && (
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
