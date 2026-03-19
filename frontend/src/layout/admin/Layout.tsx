import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Topbar, { menuContents } from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import usePermissions from "@/hooks/usePermissions";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { has } = usePermissions();
  const visibleItems = menuContents.filter((item) => has(item.permission));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="min-h-screen bg-background">
      <Topbar handleDrawerToggle={handleDrawerToggle} />

      {/* Desktop sidebar */}
      <div className="peer hidden sm:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Mobile sidebar */}
      <nav
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-56 bg-card border-r transform transition-transform duration-200 sm:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="p-2 space-y-1">
          {visibleItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.link}
                end={item.link === "/dashboard"}
                onClick={handleDrawerToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-accent"
                  }`
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content — offset by collapsed sidebar width on desktop */}
      <main className="pt-14 min-h-screen sm:ml-14 peer-hover:sm:ml-52 transition-[margin-left] duration-200 ease-in-out">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
