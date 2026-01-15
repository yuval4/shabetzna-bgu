import { SetMetadata } from '@nestjs/common';
import { Role } from '../consts/role.enum';

export const MISSION_ROLES_KEY = 'mission_roles';
export const MissionRoles = (...roles: Role[]) => SetMetadata(MISSION_ROLES_KEY, roles);