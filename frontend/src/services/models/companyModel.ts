import { ApiCore } from "../utilities/core";

const url = "company";

export const apiCompany = new ApiCore({
  getAll: true,
  post: true,
  url: url,
});
