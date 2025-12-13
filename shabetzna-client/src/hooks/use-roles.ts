import { useContext } from "react";
import { TeamContext } from "../context/team-context";
import { Role } from "../shared/enums/roles";
import { UserContext } from "../context/user-context";
import { User } from "../shared/types/entities/user";

export const useRoles = () => {
  const { role } = useContext(TeamContext);
  const { user } = useContext(UserContext);

  const hasRole = (roles: Role[]) => {
    return roles.includes(role);
  };

  const hasRoleOrOwnership = (roles: Role[], dataOwnerId: User["id"]) => {
    return hasRole(roles) || user?.id === dataOwnerId;
  };

  const hasRoleAndOwnership = (roles: Role[], dataOwnerId: User["id"]) => {
    return hasRole(roles) && user?.id === dataOwnerId;
  };

  const hasOwnerShip = (dataOwnerId: User["id"]) => {
    return user?.id === dataOwnerId;
  };

  return { hasRole, hasRoleOrOwnership, hasRoleAndOwnership, hasOwnerShip };
};
