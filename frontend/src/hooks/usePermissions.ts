const usePermissions = () => {
  const raw = localStorage.getItem("CRM-permissions");
  const permissions: string[] = raw ? JSON.parse(raw) : [];

  const has = (key: string) =>
    key === "dashboard" || permissions.includes("admin") || permissions.includes(key);

  const isAdmin = permissions.includes("admin");

  return { permissions, has, isAdmin };
};

export default usePermissions;
