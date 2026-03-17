import { ApiCore } from "../utilities/core";

const url = "todos";

export const apiTodos = new ApiCore({
  put: true,
  remove: true,
  url,
});
