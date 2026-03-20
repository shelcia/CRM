import { PERMISSION_GROUPS } from "../constants";

export const checkedToPermissions = (checked: boolean[][]) =>
  PERMISSION_GROUPS.flatMap((g, gi) =>
    g.keys.filter((_, ki) => checked[gi][ki]),
  );

export const permissionsToChecked = (permissions: string[]) => {
  const isAdmin = permissions.includes("admin");
  return PERMISSION_GROUPS.map((g) =>
    g.keys.map((k) => isAdmin || permissions.includes(k)),
  );
};
