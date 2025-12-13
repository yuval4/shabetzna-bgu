import { dateWithoutTime } from './date-without-time';

export const getDatesBetween = (
  start: Date | string,
  end: Date | string,
): Date[] => {
  const dates: Date[] = [];

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    throw new Error('Invalid date range: start or end date is not valid');

  const current = new Date(dateWithoutTime(startDate));
  const last = new Date(dateWithoutTime(endDate));

  while (current <= last) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
};
