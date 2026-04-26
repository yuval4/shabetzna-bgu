import { SetMetadata } from '@nestjs/common';
import { MissionRole } from '../consts/mission-role.enum';

export const MISSION_ROLES_KEY = 'mission_roles';
export const MissionRoles = (...roles: MissionRole[]) => SetMetadata(MISSION_ROLES_KEY, roles);