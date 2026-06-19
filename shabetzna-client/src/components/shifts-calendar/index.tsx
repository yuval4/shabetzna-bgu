import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { SHIFT_TYPE, ShiftType } from "../../shared/enums/shift-type";
import theme from "../../shared/theme";
import { Shift } from "../../shared/types/entities/shift";
import style from "./style.module.css";

interface ShiftsCalendarProps {
  shifts: Shift[];
  loading: boolean;
  selectedWeekStart?: Date;
  selectedWeekEnd?: Date;
  currentMonthDate?: Date;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
}

const ShiftsCalendar = ({
  shifts,
  loading,
  selectedWeekStart,
  selectedWeekEnd,
  currentMonthDate: propCurrentDate,
  onPrevWeek,
  onNextWeek,
}: ShiftsCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(propCurrentDate || new Date());
  const displayDate = propCurrentDate || currentDate;
  const isPhone = useMediaQuery(theme.breakpoints.down("md"));

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create shifts map for quick lookup
  const shiftsMap = new Map<string, Shift[]>();
  shifts.forEach((shift) => {
    const date =
      typeof shift.date === "string" ? new Date(shift.date) : shift.date;
    const dateKey = date.toISOString().split("T")[0];
    if (!shiftsMap.has(dateKey)) {
      shiftsMap.set(dateKey, []);
    }
    shiftsMap.get(dateKey)!.push(shift);
  });

  const handlePrevMonth = () => {
    if (onPrevWeek) {
      onPrevWeek();
    }
  };

  const handleNextMonth = () => {
    if (onNextWeek) {
      onNextWeek();
    }
  };

  const monthName = new Date(year, month).toLocaleDateString("he-IL", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  if (loading) {
    return <Typography>טוען...</Typography>;
  }

  return (
    <Box className={style.container}>
      <Box className={style.header}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
        <Typography variant="h6" className={style.monthTitle}>
          {monthName}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Week day headers */}
      <Grid container spacing={0.5} className={style.weekDaysHeader}>
        {weekDays.map((day) => (
          <Grid item xs={12 / 7} key={day} className={style.weekDayCell}>
            <Typography variant="caption" className={style.weekDayText}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar grid */}
      <Grid container spacing={0.5} pb={0.3} className={style.calendarGrid}>
        {calendarDays.map((day, index) => {
          const dateKey =
            day !== null
              ? new Date(year, month, day).toISOString().split("T")[0]
              : null;
          const dayShifts = dateKey ? shiftsMap.get(dateKey) : [];

          // Check if day is in selected week
          const dayDate = day !== null ? new Date(year, month, day) : null;
          const isInSelectedWeek =
            dayDate && selectedWeekStart && selectedWeekEnd
              ? dayDate >= selectedWeekStart && dayDate <= selectedWeekEnd
              : false;

          return (
            <Grid item xs={12 / 7} key={index} className={style.dayCell}>
              <Paper
                className={`${style.dayPaper} ${
                  day === null ? style.emptyDay : ""
                } ${dayShifts && dayShifts.length > 0 ? style.hasShifts : ""} ${isInSelectedWeek ? style.selectedWeek : ""}`}
                elevation={1}
              >
                {day && (
                  <>
                    <Typography className={style.dayNumber}>{day}</Typography>
                    <Box className={style.shiftsContainer}>
                      {dayShifts && dayShifts.length > 0 ? (
                        dayShifts.map((shift, idx) => (
                          <Box key={idx} className={style.shift}>
                            <Typography
                              variant="caption"
                              className={style.shiftUser}
                            >
                              {shift.assignedUser?.username || "לא הוגדר"}
                            </Typography>
                            <Typography
                              variant="caption"
                              className={style.shiftType}
                            >
                              {SHIFT_TYPE[shift.shiftType as ShiftType].label}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption" className={style.noShift}>
                          ×
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ShiftsCalendar;
