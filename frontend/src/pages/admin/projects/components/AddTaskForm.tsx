import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomTextAreaField, CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";
import type { Todo } from "../types";

interface AddTaskFormProps {
  onSubmit: (
    todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">,
  ) => void;
  onCancel: () => void;
}

const AddTaskForm = ({ onSubmit, onCancel }: AddTaskFormProps) => {
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      title: "",
      description: "",
      author: { name: "", image: "/static/avatar/001-man.svg" },
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3, "Too short").required("Required"),
    }),
    onSubmit: (v) =>
      onSubmit({
        title: v.title,
        description: v.description,
        author: v.author,
      }),
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card p-3 space-y-2 shadow-sm"
    >
      <CustomTextField
        name="title"
        placeholder="Card title"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <CustomTextAreaField
        name="description"
        placeholder="Description (optional)"
        rows={2}
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex gap-2 justify-end w-full">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" variant="outline">
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
