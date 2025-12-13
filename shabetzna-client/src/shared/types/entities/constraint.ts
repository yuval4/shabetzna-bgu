import { ConstraintType } from "../../enums/constraint-types";
import { ConstraintStatus } from "../../enums/constraint-status";
import { User } from "./user";
import { ShiftType } from "../../enums/shift-type";

export interface Constraint {
  id: string;
  user: User;
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
