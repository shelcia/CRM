import { useEffect, useState } from "react";
import { apiUsers } from "@/services/models/usersModel";

interface User {
  _id: string;
  name: string;
}

/**
 * Fetches the user list (cached) and returns select-ready items.
 * Values are user names since `assignedTo` is stored as a name string.
 */
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    apiUsers.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setUsers(res);
    });
    return () => controller.abort();
  }, []);

  const userItems = users.map((u) => ({ val: u.name, label: u.name }));
  return { userItems };
};

export default useUsers;
