export const convertDateToDateWithTime = (date: string | number | Date) => {
  const dates = new Date(date);
  const formattedDate = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(dates);
  return formattedDate;
};

export const convertDateToDateWithoutTime = (date: string | number | Date) => {
  if (!date) return null;
  const dates = new Date(date);
  const formattedDate = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(dates);
  return formattedDate;
};

export const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export const getFmtCurrencyVal = (val: number, c: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(val);
