import dateFormat from "dateformat";

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-UK");
};

export const formatDateToUrl = (date: Date) => {
  return dateFormat(date, "yyyy-mm-dd");
};

export const dateWithoutTime = (date: Date) => {
  return new Date(new Date(formatDateToUrl(date)).setHours(0, 0, 0, 0));
};

export const weekDay = (date: Date) => {
  return new Date(date)
    .toLocaleString("he-il", {
      weekday: "long",
    })
    .substring(4);
};
