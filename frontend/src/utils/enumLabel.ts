/**
 * Converts an enum value to a human-readable label.
 *
 * Examples:
 *   "inProgress"  → "In Progress"
 *   "openDeal"    → "Open Deal"
 *   "veryHigh"    → "Very High"
 *   "non-admin"   → "Non Admin"
 *   "in_progress" → "In Progress"
 */
export function toLabel(val: string): string {
  return val
    .replace(/[-_]/g, " ")               // kebab-case / snake_case → spaces
    .replace(/([A-Z])/g, " $1")          // camelCase → spaces before capitals
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Converts an array of enum strings to the { val, label } shape
 * expected by CustomSelectField.
 */
export function toLabelItems(
  values: string[],
): { val: string; label: string }[] {
  return values.map((v) => ({ val: v, label: toLabel(v) }));
}
