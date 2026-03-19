import { useEffect, useState } from "react";
import { apiProvider } from "@/services/utilities/provider";

// Mirrors enums/enums.go → EnumsResponse.
// Add new fields here whenever enums.go is extended.
export type Enums = {
  roles: string[];
  contactStatuses: string[];
  contactPriorities: string[];
  ticketStatuses: string[];
  ticketPriorities: string[];
  ticketCategories: string[];
  emailTemplateStatuses: string[];
  emailTemplateFrequencies: string[];
  permissions: string[];
};

const DEFAULT: Enums = {
  roles: [],
  contactStatuses: [],
  contactPriorities: [],
  ticketStatuses: [],
  ticketPriorities: [],
  ticketCategories: [],
  emailTemplateStatuses: [],
  emailTemplateFrequencies: [],
  permissions: [],
};

// Module-level cache so the request fires only once per session.
let cache: Enums | null = null;
const listeners: Array<(e: Enums) => void> = [];

function fetchOnce() {
  if (cache) return;
  const controller = new AbortController();
  apiProvider.getAll("enums", controller.signal, false).then((res) => {
    if (res && typeof res === "object" && "roles" in res) {
      cache = { ...DEFAULT, ...(res as Enums) };
      listeners.forEach((fn) => fn(cache!));
      listeners.length = 0;
    }
  });
}

/**
 * Returns the full set of CRM enums fetched from GET /api/enums.
 * The request is made once and cached for the lifetime of the page.
 *
 * Usage:
 *   const { roles, contactStatuses } = useEnums();
 */
export function useEnums(): Enums {
  const [enums, setEnums] = useState<Enums>(cache ?? DEFAULT);

  useEffect(() => {
    if (cache) {
      setEnums(cache);
      return;
    }
    listeners.push(setEnums);
    fetchOnce();
    return () => {
      const idx = listeners.indexOf(setEnums);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return enums;
}
