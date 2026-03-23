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
    <form onSubmit={handleSubmit} className="space-y-2">
      <CustomTextField
        name="name"
        placeholder="Column name"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddColumnForm;
