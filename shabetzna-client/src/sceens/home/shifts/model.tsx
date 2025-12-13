import { Column } from "../../../components/shifts-table/models";
import { formatDate, weekDay } from "../../../shared/dates/format-date";
import { SHIFT_TYPE, ShiftType } from "../../../shared/enums/shift-type";
import { formatPhone } from "../../../shared/format/phone";
import { Shift } from "../../../shared/types/entities/shift";

export const columns: Column<Shift>[] = [
  {
    name: "isReadiness",
    label: "",
    format: (isReadiness) => (isReadiness ? "פ+" : ""),
  },
  {
    name: "date",
    label: "תאריך",
    format: formatDate,
    sortby: (a, b) =>
      a?.date && b?.date ? a.date.getDate() - b.date.getDate() : 0,
  },
  { name: "date", label: "יום", format: weekDay },
  {
    name: "shiftType", label: "סוג משמרת",
    format: (value) => SHIFT_TYPE[value as ShiftType].label,
  },
  {
    name: "assignedUser.username",
    label: "כונן",
    sortby: (a, b) =>
      (a?.assignedUser.username || "").localeCompare(
        b?.assignedUser.username || ""
      ),
  },
  { name: "assignedUser.phone", label: "טלפון", format: formatPhone },
];

export const minimizedColumns: Column<Shift>[] = [
  {
    name: "isReadiness",
    label: "",
    format: (isReadiness) => (isReadiness ? "פ+" : ""),
    width: 45
  },
  {
    name: "date",
    label: "משמרת",
    format: (value, row) =>
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {row.assignedUser.username}
          </span>
          <span>
            {formatPhone(row.assignedUser.phone)} 📞
          </span>
        </div>
        <div>יום {weekDay(value)} - {SHIFT_TYPE[row.shiftType as ShiftType].label}</div>
      </>
  }
];
