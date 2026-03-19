import { ApiCore } from "../utilities/core";
import { BASE_URL } from "../api";

const getToken = () => localStorage.getItem("CRM-token") ?? "";

export const apiDeals = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  putById: true,
  remove: true,
  url: "deals",
});

export const getDealsByContact = (contactId: string): Promise<any[]> =>
  fetch(`${BASE_URL}/deals?contactId=${contactId}`, {
    headers: { "auth-token": getToken() },
  }).then((res) => res.json());
