import { ApiCore } from "../utilities/core";

const url = "projects/";

export const apiProjects = new ApiCore({
  getAll: true,
  post: true,
  put: true,
  remove: true,
  url,
});
