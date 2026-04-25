import { ConstraintStatus } from "../../enums/constraint-status";
import { ConstraintType } from "../../enums/constraint-types";
import { ShiftType } from "../../enums/shift-type";
import { User } from "./user";

export interface Constraint {
  id: string;
  user: User;
  missionId?: string;
  date: Date;
  type: ConstraintType;
  reason: string;
  status: ConstraintStatus;
  shiftType: ShiftType;
  deletedAt: Date;
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
  updatedBy: User;
}
