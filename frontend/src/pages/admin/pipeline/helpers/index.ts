import * as Yup from "yup";
import { STAGES } from "../constants";
import { IDeal } from "../types";

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map(
  (c) => ({ val: c, label: c }),
);
export const STAGE_ITEMS = STAGES.map((s) => ({ val: s.key, label: s.label }));

export const makeDealInitialValues = (
  deal?: IDeal,
  defaultStage?: string,
  defaultContactId?: string,
  defaultContactName?: string,
) => ({
  title: deal?.title ?? "",
  contactName: deal?.contactName ?? defaultContactName ?? "",
  contactId: deal?.contactId ?? defaultContactId ?? "",
  value: deal?.value?.toString() ?? "",
  currency: deal?.currency ?? "USD",
  stage: deal?.stage ?? defaultStage ?? "lead",
  assignedTo: deal?.assignedTo ?? "",
  expectedClose: deal?.expectedClose ? deal.expectedClose.slice(0, 10) : "",
});

export const dealValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  value: Yup.number().min(0, "Must be ≥ 0").required("Value is required"),
  currency: Yup.string().required(),
  stage: Yup.string().required(),
});
