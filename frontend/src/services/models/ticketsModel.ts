import { ApiCore } from "../utilities/core";

const url = "tickets";

export const apiTickets = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  putById: true,
  remove: true,
  url: url,
});
