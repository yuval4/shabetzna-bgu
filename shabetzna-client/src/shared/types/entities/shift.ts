import { ShiftType } from "../../enums/shift-type";
import { Team } from "./team";
import { User } from "./user";

export interface Shift {
  id: string;
  team: Team;
  teamId: Team["id"];
  date: Date;
  shiftType: ShiftType;
  assignedUser: User;
  comment: string;
  isHoliday: boolean;
  isVacation: boolean;
  hasAfter: boolean;
  isReadiness: boolean;
  bonus: number;
  deletedAt: Date;
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
  updatedBy: User;
}
