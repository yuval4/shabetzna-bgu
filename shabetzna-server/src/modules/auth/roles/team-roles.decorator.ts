import { SetMetadata } from '@nestjs/common';
import { Role } from '../consts/role.enum';

export const TEAM_ROLES_KEY = 'team_roles';
export const TeamRoles = (...roles: Role[]) => SetMetadata(TEAM_ROLES_KEY, roles);
