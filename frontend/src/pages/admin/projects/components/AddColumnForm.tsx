import { useFormik } from "formik";
import { emptyColumn, columnValidationSchema } from "../helpers";
import { CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";

interface AddColumnFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const AddColumnForm = ({ onSubmit, onCancel }: AddColumnFormProps) => {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: emptyColumn,
    validationSchema: columnValidationSchema,
    onSubmit: (v) => onSubmit(v.name),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <CustomTextField
        name="name"
        label="Column Name"
        placeholder="Column name"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="flex-1">
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddColumnForm;
