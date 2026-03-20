import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Phone, TicketCheck, Kanban, CheckSquare } from "lucide-react";
import { apiProvider } from "@/services/utilities/provider";
import usePermissions from "@/hooks/usePermissions";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { menuContents } from "@/layout/admin/components/Topbar";
import { Kbd, KbdGroup } from "../ui/kbd";

// ── Types ─────────────────────────────────────────────────────────────────────

type Source = "contact" | "ticket" | "deal" | "project";

interface SearchResult {
  id: string;
  label: string;
  sub?: string;
  source: Source;
  href: string;
}

// ── Module-level cache (shared across renders) ─────────────────────────────────

let _cache: SearchResult[] | null = null;
let _cacheTs = 0;
const CACHE_MS = 2 * 60_000; // 2 min — align with API cache

// ── Source meta ───────────────────────────────────────────────────────────────

const SOURCE_ICON: Record<Source, React.ReactNode> = {
  contact: <Phone className="size-3.5 text-primary" />,
  ticket: <TicketCheck className="size-3.5 text-red-500" />,
  deal: <Kanban className="size-3.5 text-amber-500" />,
  project: <CheckSquare className="size-3.5 text-purple-500" />,
};

const SOURCE_LABEL: Record<Source, string> = {
  contact: "Contact",
  ticket: "Ticket",
  deal: "Deal",
  project: "Project",
};

const SOURCE_ORDER: Source[] = ["contact", "ticket", "deal", "project"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toResults(
  arr: unknown[],
  source: Source,
  mapFn: (item: any) => SearchResult | null,
): SearchResult[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, 50).map(mapFn).filter(Boolean) as SearchResult[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const { has } = usePermissions();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fetch data on open
  useEffect(() => {
    if (!open) return;

    // Use module-level cache
    if (_cache && Date.now() - _cacheTs < CACHE_MS) {
      setResults(_cache);
      return;
    }

    setLoading(true);
    const sig = new AbortController().signal;

    const fetches: Promise<SearchResult[]>[] = [];

    if (has("contacts-view")) {
      fetches.push(
        apiProvider.getAll("contacts", sig, true).then((res: any) =>
          toResults(res, "contact", (c) => ({
            id: `contact-${c._id}`,
            label: c.name,
            sub: c.email || c.company || undefined,
            source: "contact" as Source,
            href: "/dashboard/contacts",
          })),
        ),
      );
    }

    if (has("tickets-view")) {
      fetches.push(
        apiProvider.getAll("tickets", sig, true).then((res: any) =>
          toResults(res, "ticket", (t) => ({
            id: `ticket-${t._id}`,
            label: t.title,
            sub: t.contact || t.status || undefined,
            source: "ticket" as Source,
            href: "/dashboard/tickets",
          })),
        ),
      );
    }

    if (has("pipeline-view")) {
      fetches.push(
        apiProvider.getAll("deals", sig, true).then((res: any) =>
          toResults(res, "deal", (d) => ({
            id: `deal-${d._id}`,
            label: d.title,
            sub: d.contactName || d.stage || undefined,
            source: "deal" as Source,
            href: "/dashboard/pipeline",
          })),
        ),
      );
    }

    if (has("todos-view")) {
      fetches.push(
        apiProvider.getAll("projects", sig, true).then((res: any) =>
          toResults(res, "project", (p) => ({
            id: `project-${p._id}`,
            label: p.name,
            sub: `${p.totalTasks ?? 0} tasks`,
            source: "project" as Source,
            href: `/dashboard/todos/${p._id}`,
          })),
        ),
      );
    }

    Promise.all(fetches)
      .then((groups) => {
        const flat = groups.flat();
        _cache = flat;
        _cacheTs = Date.now();
        setResults(flat);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  const runAndClose = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  // Group results by source for display
  const grouped = SOURCE_ORDER.map((source) => ({
    source,
    items: results.filter((r) => r.source === source),
  })).filter((g) => g.items.length > 0);

  // Visible nav pages (filtered by permission)
  const visiblePages = menuContents
    .flatMap((item) => (item.children ? item.children : [item]))
    .filter((item) => has(item.permission));

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-md border bg-muted/40 text-muted-foreground hover:bg-muted transition-colors w-full max-w-xs"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left text-xs">Search…</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search contacts, tickets, deals, projects…" />
        <CommandList>
          {loading ? (
            <CommandEmpty>Loading…</CommandEmpty>
          ) : (
            <>
              {/* Pages group */}
              <CommandGroup heading="Pages">
                {visiblePages.map((page) => (
                  <CommandItem
                    key={page.link}
                    value={page.title}
                    onSelect={() => runAndClose(page.link)}
                    className="flex items-center gap-2"
                  >
                    <span className="size-3.5 flex items-center justify-center text-muted-foreground">
                      {page.icon}
                    </span>
                    <span className="flex-1 text-sm">{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {grouped.length > 0 && <CommandSeparator />}

              {grouped.map(({ source, items }, idx) => (
                <>
                  <CommandGroup
                    key={source}
                    heading={SOURCE_LABEL[source] + "s"}
                  >
                    {items.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={`${result.label} ${result.sub ?? ""} ${result.source}`}
                        onSelect={() => runAndClose(result.href)}
                        className="flex items-center gap-2"
                      >
                        <span className="size-3.5 flex items-center justify-center shrink-0">
                          {SOURCE_ICON[result.source]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {result.label}
                          </p>
                          {result.sub && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result.sub}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                          {SOURCE_LABEL[result.source]}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {idx < grouped.length - 1 && (
                    <CommandSeparator key={`sep-${source}`} />
                  )}
                </>
              ))}

              {!loading && results.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
