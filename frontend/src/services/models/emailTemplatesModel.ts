import { ApiCore } from "../utilities/core";

const url = "email-templates";

export const apiEmailTemplates = new ApiCore({
  getAll: true,
  post: true,
  putById: true,
  remove: true,
  url: url,
});
