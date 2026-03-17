import { ApiCore } from "../utilities/core";

const url = "contacts";

export const apiContacts = new ApiCore({
  getAll: true,
  post: true,
  url: url,
});
