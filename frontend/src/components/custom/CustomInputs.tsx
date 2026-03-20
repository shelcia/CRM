import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FieldProps {
  name: string;
  placeholder?: string;
  values: Record<string, any>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  touched: Record<string, any>;
  errors: Record<string, any>;
  type?: string;
  props?: Record<string, any>;
}
interface TextFieldProps extends FieldProps {
  label?: string;
  color?: string;
  rightAdornment?: React.ReactNode;
  inputClassName?: string;
}

export const CustomTextField = ({
  name,
  label = "",
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  type = "text",
  rightAdornment,
  inputClassName,
}: TextFieldProps) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  const resolvedType = isPassword ? (visible ? "text" : "password") : type;
  const resolvedAdornment = isPassword ? (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground transition-colors"
      tabIndex={-1}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  ) : rightAdornment;
  const resolvedClassName = isPassword ? cn("pr-9", inputClassName) : inputClassName;

  const input = (
    <Input
      id={name}
      name={name}
      placeholder={placeholder}
      value={values[name] ?? ""}
      onChange={handleChange}
      type={resolvedType}
      error={Boolean(touched[name] && errors[name])}
      helperText={touched[name] && errors[name]}
      className={resolvedClassName}
    />
  );
  return (
    <div className="w-full space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      {resolvedAdornment ? (
        <div className="relative">
          {input}
          {resolvedAdornment}
        </div>
      ) : (
        input
      )}
    </div>
  );
};

export const CustomTextAreaField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  rows = 5,
}: FieldProps & { rows?: number }) => {
  return (
    <div className="w-full">
      <Textarea
        name={name}
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        rows={rows}
        className={cn(touched[name] && errors[name] && "border-destructive")}
      />
      {touched[name] && errors[name] && (
        <p className="text-xs text-destructive mt-1">{errors[name]}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  values: Record<string, any>;
  handleChange: (e: any) => void;
  touched: Record<string, any>;
  errors: Record<string, any>;
  labelItms: { val: string; label: string }[];
}

export const CustomSelectField = ({
  name,
  label = "",
  values,
  handleChange,
  touched,
  errors,
  labelItms,
}: SelectFieldProps) => {
  return (
    <div className="w-full space-y-1">
      {label && <Label htmlFor={name}>{`Enter ${label}`}</Label>}
      <Select
        value={values[name]}
        onValueChange={(val) => handleChange({ target: { name, value: val } })}
      >
        <SelectTrigger id={name} error={Boolean(touched[name] && errors[name])}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {labelItms.map((itm) => (
            <SelectItem key={itm.val} value={itm.val}>
              {itm.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {touched[name] && errors[name] && (
        <p className="text-xs text-destructive">{errors[name]}</p>
      )}
    </div>
  );
};

interface CheckBoxFieldProps {
  label?: string;
  labelItms?: string[];
  checked: boolean[];
  setChecked: (val: boolean[]) => void;
}

export const CustomMultipleCheckBoxField = ({
  label = "",
  labelItms = [],
  checked,
  setChecked,
}: CheckBoxFieldProps) => {
  const allChecked = checked.every(Boolean);
  const someChecked = checked.some(Boolean) && !allChecked;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`parent-${label}`}
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={(val) => {
            setChecked(Array.from({ length: labelItms.length }, () => !!val));
          }}
        />
        <label
          htmlFor={`parent-${label}`}
          className="text-sm font-medium cursor-pointer"
        >
          {label}
        </label>
      </div>
      <div className="ml-6 flex flex-col gap-1">
        {labelItms.map((itm, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Checkbox
              id={`${label}-${idx}`}
              checked={checked[idx]}
              onCheckedChange={(val) => {
                const arr = [...checked];
                arr[idx] = !!val;
                setChecked(arr);
              }}
            />
            <label
              htmlFor={`${label}-${idx}`}
              className="text-sm cursor-pointer"
            >
              {itm}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
