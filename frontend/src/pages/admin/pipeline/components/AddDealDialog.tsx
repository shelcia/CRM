import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/custom";
import {
  CustomTextField,
  CustomSelectField,
} from "@/components/custom/CustomInputs";
import { Label } from "@/components/ui/label";
import { apiDeals } from "@/services/models/dealsModel";
import { AssignedToSelect, ContactSelect } from "@/components/common";
import { IDeal } from "../types";
import { CURRENCIES, STAGE_ITEMS, makeDealInitialValues, dealValidationSchema } from "../helpers";
import { DatePicker } from "@/components/custom";

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

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: makeDealInitialValues(deal, defaultStage, defaultContactId, defaultContactName),
      validationSchema: dealValidationSchema,
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
          expectedClose: vals.expectedClose ? vals.expectedClose + "T00:00:00Z" : undefined,
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
    <CustomModal
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && !isEdit) resetForm();
      }}
      title={isEdit ? "Edit Deal" : "New Deal"}
      trigger={trigger}
      size="md"
    >
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
          <div className="space-y-1">
            <Label>Contact</Label>
            <ContactSelect
              value={values.contactName}
              onChange={(name, id) => {
                handleChange({ target: { name: "contactName", value: name } });
                handleChange({ target: { name: "contactId", value: id } });
              }}
            />
          </div>
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
            <DatePicker
              value={values.expectedClose}
              onChange={(date) =>
                handleChange({
                  target: { name: "expectedClose", value: date },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Assigned To</Label>
            <AssignedToSelect
              value={values.assignedTo ?? ""}
              onChange={(v) =>
                handleChange({ target: { name: "assignedTo", value: v } })
              }
            />
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
    </CustomModal>
  );
};

export default AddDealDialog;
