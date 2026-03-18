import { ApiCore } from "../utilities/core";
import { BASE_URL } from "../api";

const url = "contacts";

export const apiContacts = new ApiCore({
  getAll: true,
  post: true,
  postFormData: true,
  putById: true,
  remove: true,
  url: url,
});

const getToken = () => localStorage.getItem("CRM-token");

export const exportContacts = (): Promise<void> =>
  fetch(`${BASE_URL}/contacts/export`, {
    headers: { "auth-token": getToken() ?? "" },
  }).then((res) => {
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  }).then((blob) => {
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(href);
  });

export const importContacts = (file: File): Promise<{ imported: number; skipped: string[] }> => {
  const form = new FormData();
  form.append("file", file);
  return fetch(`${BASE_URL}/contacts/import`, {
    method: "POST",
    headers: { "auth-token": getToken() ?? "" },
    body: form,
  }).then((res) => res.json());
};
