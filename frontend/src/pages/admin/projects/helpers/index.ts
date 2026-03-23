import * as Yup from "yup";

export const emptyTask = {
  title: "",
  description: "",
  author: { name: "", image: "/static/avatar/001-man.svg" },
};

export const taskValidationSchema = Yup.object({
  title: Yup.string().min(3, "Too short").required("Required"),
});

export const emptyColumn = { name: "" };

export const columnValidationSchema = Yup.object({
  name: Yup.string().min(2, "Too short").required("Required"),
});
