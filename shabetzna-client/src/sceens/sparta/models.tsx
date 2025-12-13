import { Tooltip } from "@mui/material";
import { Column } from "../../components/shifts-table/models";
import { SHIFT_TYPE, ShiftType } from "../../shared/enums/shift-type";
import { formatPhone } from "../../shared/format/phone";
import { Shift } from "../../shared/types/entities/shift";

export const columns: Column<Shift>[] = [
  {
    name: "isReadiness",
    label: "",
    format: (isReadiness) => (isReadiness ? "פ+" : ""),
  },
  {
    name: "team.name",
    label: "צוות",
    format: (value, row) => `${value} ${row?.team?.phone ? `(${row.team.phone} 📞)` : ""}`,
    sortby: (a, b) => (a?.team.name || "").localeCompare(b?.team.name || ""),
  },
  {
    name: "shiftType", label: "סוג משמרת",
    format: (value) => SHIFT_TYPE[value as ShiftType].label,
  },
  {
    name: "assignedUser.username",
    label: "כונן",
    sortby: (a, b) => (a?.team.name || "").localeCompare(b?.team.name || ""),
  },
  { name: "assignedUser.phone", label: "טלפון", format: formatPhone },
  {
    label: 'הערות',
    name: "team.description",
  }
];

export const minimizedColumns: Column<Shift>[] = [
  {
    name: "isReadiness",
    label: "",
    format: (isReadiness) => (isReadiness ? "פ+" : ""),
  },
  {
    name: "team.name",
    label: "צוות",
    format: (value, row) => <>
      <div>{value} {row.team.description && <Tooltip title={row.team.description}><span>ⓘ</span></Tooltip>}</div>
      <div>{SHIFT_TYPE[row.shiftType].label}</div>
    </>,
    sortby: (a, b) => (a?.team.name || "").localeCompare(b?.team.name || ""),
  },
  {
    name: "assignedUser.username",
    label: "כונן",
    sortby: (a, b) => (a?.team.name || "").localeCompare(b?.team.name || ""),
  },
  {
    name: "assignedUser.phone", label: "טלפון",
    format: (value, row) => <>
      <div>{formatPhone(value)}</div>
      {row.team.phone && <div>({row.team.phone} 📞)</div>}
    </>,
  },
];
