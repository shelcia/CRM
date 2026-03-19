import { STAGES } from "../constants";

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map(
  (c) => ({ val: c, label: c }),
);
export const STAGE_ITEMS = STAGES.map((s) => ({ val: s.key, label: s.label }));
