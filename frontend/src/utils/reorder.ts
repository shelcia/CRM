/** Moves an item from index `from` to index `to` in a list, returning a new array. */
const reorder = <T,>(list: T[], from: number, to: number): T[] => {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
};

export default reorder;
