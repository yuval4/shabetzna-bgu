import { createContext, useState } from "react";
import { addDays, getFirstDayOfWeek } from "../shared/dates/time-utils";
import { TimeRange } from "../shared/types/time-range";
import { dateWithoutTime } from "../shared/dates/format-date";

const DAYS = 6;

interface TimeRangeViewState {
  timeRange: TimeRange;
  days: number; // ? delete?
  setDays: (days: number) => void;
  handleNextWeek: () => void;
  handlePrevWeek: () => void;
}
const sunday = getFirstDayOfWeek(new Date());
const initTimeRange = {
  start: dateWithoutTime(sunday),
  end: dateWithoutTime(addDays(sunday, DAYS)),
};

export const TimeRangeViewContext = createContext<TimeRangeViewState>({
  timeRange: initTimeRange,
  days: DAYS,
  setDays: () => null,
  handleNextWeek: () => null,
  handlePrevWeek: () => null,
});

export const TimeRangeViewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [timeRange, setTimeRange] = useState(initTimeRange);
  const [days, setDays] = useState(DAYS);

  const setStartDate = (date: Date) =>
    setTimeRange({ start: dateWithoutTime(date), end: dateWithoutTime(addDays(date, days)) });

  const handleNextWeek = () => setStartDate(addDays(timeRange.start, 7));
  const handlePrevWeek = () => setStartDate(addDays(timeRange.start, -7));

  return (
    <TimeRangeViewContext.Provider
      value={{ timeRange, days, setDays, handleNextWeek, handlePrevWeek }}
    >
      {children}
    </TimeRangeViewContext.Provider>
  );
};
