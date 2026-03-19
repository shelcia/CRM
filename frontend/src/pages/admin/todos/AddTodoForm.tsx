import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomTextAreaField, CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";
import type { Todo } from "./types";

interface AddTodoFormProps {
  onSubmit: (
    todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">,
  ) => void;
  onCancel: () => void;
}

const AddTodoForm = ({ onSubmit, onCancel }: AddTodoFormProps) => {
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
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add card
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;
