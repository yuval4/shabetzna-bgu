import { Unit } from "./unit";
import { User } from "./user";
import { UserToTeam } from "./user-to-team";

export interface Team {
  id: string;
  name: string;
  phone: string;
  unitId: Unit["id"];
  description: string;
  users: UserToTeam[];
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
  updatedBy: User;
}
