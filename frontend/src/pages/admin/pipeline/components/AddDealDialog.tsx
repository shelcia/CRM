import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomTextField,
  CustomSelectField,
} from "@/components/custom/CustomInputs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiDeals } from "@/services/models/dealsModel";
import useUsers from "@/hooks/useUsers";
import { IDeal } from "../types";
import { CURRENCIES, STAGE_ITEMS } from "../helpers";

interface IAddDealDialogProps {
  deal?: IDeal;
  onCreated?: (deal: IDeal) => void;
  onUpdated?: (deal: IDeal) => void;
  defaultStage?: string;
  defaultContactId?: string;
  defaultContactName?: string;
  trigger: React.ReactNode;
}

const AddDealDialog = ({
  deal,
  onCreated,
  onUpdated,
  defaultStage,
  defaultContactId,
  defaultContactName,
  trigger,
}: IAddDealDialogProps) => {
  const isEdit = !!deal;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { userItems } = useUsers();

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        title: deal?.title ?? "",
        contactName: deal?.contactName ?? defaultContactName ?? "",
        contactId: deal?.contactId ?? defaultContactId ?? "",
        value: deal?.value?.toString() ?? "",
        currency: deal?.currency ?? "USD",
        stage: deal?.stage ?? defaultStage ?? "lead",
        assignedTo: deal?.assignedTo ?? "",
        expectedClose: deal?.expectedClose
          ? deal.expectedClose.slice(0, 10)
          : "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("Title is required"),
        value: Yup.number().min(0, "Must be ≥ 0").required("Value is required"),
        currency: Yup.string().required(),
        stage: Yup.string().required(),
      }),
      onSubmit: (vals) => {
        setSaving(true);
        const payload = {
          title: vals.title,
          contactName: vals.contactName || undefined,
          contactId: vals.contactId || undefined,
          value: Number(vals.value),
          currency: vals.currency,
          stage: vals.stage,
          assignedTo: vals.assignedTo || undefined,
          expectedClose: vals.expectedClose || undefined,
        };
        if (isEdit) {
          apiDeals.putById!(
            deal._id,
            payload,
            new AbortController().signal,
            "",
            true,
          ).then((res) => {
            setSaving(false);
            if (res?._id) {
              toast.success("Deal updated");
              onUpdated?.(res as IDeal);
              setOpen(false);
            } else {
              toast.error(res?.message ?? "Failed to update deal");
            }
          });
        } else {
          apiDeals.post!(payload, "", true).then((res) => {
            setSaving(false);
            if (res?._id) {
              toast.success("Deal created");
              onCreated?.(res as IDeal);
              setOpen(false);
              resetForm();
            } else {
              toast.error(res?.message ?? "Failed to create deal");
            }
          });
        }
      },
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && !isEdit) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Deal" : "New Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <CustomTextField
            label="Title"
            name="title"
            placeholder="e.g. Acme Corp — Enterprise Plan"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <CustomTextField
            label="Contact"
            name="contactName"
            placeholder="Contact name"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <div className="grid grid-cols-2 gap-3">
            <CustomTextField
              label="Value"
              name="value"
              type="number"
              placeholder="0"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomSelectField
              label="Currency"
              name="currency"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={CURRENCIES}
            />
          </div>
          <CustomSelectField
            label="Stage"
            name="stage"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={STAGE_ITEMS}
          />
          <div className="space-y-1">
            <Label htmlFor="expectedClose">Expected Close</Label>
            <Input
              id="expectedClose"
              name="expectedClose"
              type="date"
              value={values.expectedClose}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label>Assigned To</Label>
            <Select
              value={values.assignedTo || "__none__"}
              onValueChange={(v) =>
                handleChange({
                  target: {
                    name: "assignedTo",
                    value: v === "__none__" ? "" : v,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Unassigned</SelectItem>
                {userItems.map((u) => (
                  <SelectItem key={u.val} value={u.val}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                if (!isEdit) resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? "Save Changes" : "Create Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealDialog;
