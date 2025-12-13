import { dateWithoutTime } from "./format-date";

export const getFirstDayOfWeek = (date: Date) => {
  const first = date.getDate() - date.getDay();

  return dateWithoutTime(new Date(date.setDate(first)));
};

export const getLastDayOfWeek = (date: Date) => {
  const last = date.getDate() - date.getDay() + 6;

  return dateWithoutTime(new Date(date.setDate(last)));
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return new Date(
    Date.UTC(
      result.getFullYear(),
      result.getMonth(),
      result.getDate(),
      0,
      0,
      0,
      0
    )
  );
};

export const isHistory = (date: Date) =>
  new Date().getTime() - new Date(date).getTime() > 24 * 60 * 60 * 1000;

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getUTCTime = (dateInput: Date = new Date()) => {
  const date = new Date(dateInput);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 6000);
};

export const getDatesBetween = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = start;

  while (dateWithoutTime(currentDate) <= dateWithoutTime(end)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};
