import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomTextField } from "@/components/custom";
import { Button } from "@/components/ui/button";

interface AddColumnFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const AddColumnForm = ({ onSubmit, onCancel }: AddColumnFormProps) => {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
    }),
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
