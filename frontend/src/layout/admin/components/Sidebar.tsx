import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { menuContents } from "./Topbar";
import usePermissions from "@/hooks/usePermissions";

const Sidebar = () => {
  const { has } = usePermissions();
  const visibleItems = menuContents.filter((item) => has(item.permission));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggle = (link: string) =>
    setOpenGroups((prev) => ({ ...prev, [link]: !prev[link] }));

  return (
    <aside className="group fixed left-0 top-14 bottom-0 z-30 w-14 hover:w-52 bg-card border-r transition-[width] duration-200 ease-in-out overflow-hidden">
      <nav className="p-2 mt-1 space-y-0.5">
        {visibleItems.map((item) =>
          item.children ? (
            <div key={item.link}>
              <button
                onClick={() => toggle(item.link)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <span className="shrink-0 h-4 w-4 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 delay-100 flex-1 text-left">
                  {item.title}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 opacity-0 group-hover:opacity-100 transition-[transform,opacity] duration-150 delay-100 ${
                    openGroups[item.link] ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
                  openGroups[item.link] ? "max-h-0 group-hover:max-h-24" : "max-h-0"
                }`}
              >
                {item.children
                  .filter((c) => has(c.permission))
                  .map((child) => (
                    <NavLink
                      key={child.link}
                      to={child.link}
                      className={({ isActive }) =>
                        `flex items-center gap-3 pl-8 pr-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`
                      }
                    >
                      <span className="shrink-0 h-4 w-4 flex items-center justify-center">
                        {child.icon}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 delay-100">
                        {child.title}
                      </span>
                    </NavLink>
                  ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={item.link}
              to={item.link}
              end={item.link === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`
              }
            >
              <span className="shrink-0 h-4 w-4 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 delay-100">
                {item.title}
              </span>
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
