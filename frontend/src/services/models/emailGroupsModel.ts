import { ApiCore } from "../utilities/core";

export const apiEmailGroups = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  putById: true,
  remove: true,
  url: "email-groups",
});
