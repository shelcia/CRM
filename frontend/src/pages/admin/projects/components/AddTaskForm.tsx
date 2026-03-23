import { useFormik } from "formik";
import { emptyTask, taskValidationSchema } from "../helpers";
import { CustomTextAreaField, CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AssignedToSelect } from "@/components/common";
import type { Todo } from "../types";

interface AddTaskFormProps {
  onSubmit: (
    todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">,
  ) => void;
  onCancel: () => void;
}

const AddTaskForm = ({ onSubmit, onCancel }: AddTaskFormProps) => {
  const { errors, values, handleChange, handleSubmit, touched, setFieldValue } =
    useFormik({
      initialValues: emptyTask,
      validationSchema: taskValidationSchema,
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
      className="rounded-lg border bg-card p-3 space-y-2.5 shadow-sm"
    >
      <div className="space-y-1">
        <Label className="text-xs">Title</Label>
        <CustomTextField
          name="title"
          placeholder="Card title"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <CustomTextAreaField
          name="description"
          placeholder="Description (optional)"
          rows={2}
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Assignee</Label>
        <AssignedToSelect
          value={values.author.name}
          onChange={(v) =>
            setFieldValue("author", {
              name: v,
              image: "/static/avatar/001-man.svg",
            })
          }
          triggerClassName="h-8 text-xs"
        />
      </div>
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
