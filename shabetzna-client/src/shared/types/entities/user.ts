import { Points } from "./points";
import { TeamToUser } from "./user-to-team";

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
  deletedAt: Date;
  updatedBy: User;
  teams: TeamToUser[];
  points: Points;
}
