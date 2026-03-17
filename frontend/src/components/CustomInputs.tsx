import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
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

export const CustomAuthInput = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  type = "text",
}: FieldProps) => {
  return (
    <Input
      name={name}
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      type={type}
      error={Boolean(touched[name] && errors[name])}
      helperText={touched[name] && errors[name]}
    />
  );
};

interface TextFieldProps extends FieldProps {
  label?: string;
  color?: string;
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
}: TextFieldProps) => {
  return (
    <div className="w-full space-y-1">
      {label && <Label htmlFor={name}>{`Enter ${label}`}</Label>}
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        value={values[name] ?? ""}
        onChange={handleChange}
        type={type}
        error={Boolean(touched[name] && errors[name])}
        helperText={touched[name] && errors[name]}
      />
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
      <textarea
        name={name}
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        rows={rows}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          touched[name] && errors[name] && "border-destructive",
        )}
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

interface ChipFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  labelItms?: { val: string; label: string }[];
}

export const CustomSelectChipField = ({
  label = "",
  labelItms = [],
}: ChipFieldProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleRemove = (val: string) => {
    setSelected(selected.filter((v) => v !== val));
  };

  return (
    <div className="w-full space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-1 min-h-[2.25rem] w-full rounded-md border border-input bg-transparent px-3 py-1.5">
        {selected.map((val) => (
          <span
            key={val}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs rounded px-2 py-0.5"
          >
            {val}
            <button onClick={() => handleRemove(val)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Select onValueChange={(val) => !selected.includes(val) && setSelected([...selected, val])}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {labelItms.map((itm) => (
            <SelectItem key={itm.val} value={itm.val}>
              {itm.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
        <label htmlFor={`parent-${label}`} className="text-sm font-medium cursor-pointer">
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
            <label htmlFor={`${label}-${idx}`} className="text-sm cursor-pointer">
              {itm}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
