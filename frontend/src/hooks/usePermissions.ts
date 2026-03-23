import { useAuth } from "@/context/AuthContext";

const usePermissions = () => {
  const { user } = useAuth();
  const permissions: string[] = user?.permissions ?? [];

  const has = (key: string) =>
    key === "dashboard" || permissions.includes("admin") || permissions.includes(key);

  const isAdmin = permissions.includes("admin");

  return { permissions, has, isAdmin };
};

export default usePermissions;
