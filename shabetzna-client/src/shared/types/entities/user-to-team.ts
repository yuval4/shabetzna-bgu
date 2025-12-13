import { Role } from "../../enums/roles";
import { Team } from "./team";
import { User } from "./user";

interface UserTeamRelation {
  id: string;
  role: Role;
  isActiveShifts: boolean;
}

export interface UserToTeam extends UserTeamRelation {
  user: User;
}

export interface TeamToUser extends UserTeamRelation {
  team: Team;
}
