import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { MissionsService } from 'src/modules/missions/missions.service';
import { Role } from '../consts/role.enum';
import { MISSION_ROLES_KEY } from '../roles/mission-roles.decorator';

@Injectable()
export class MissionRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private missionsService: MissionsService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const missionRoles = this.reflector.get<Role[]>(MISSION_ROLES_KEY, context.getHandler());

    if (!missionRoles || missionRoles.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const { user, params, body } = request;
    const missionId = params.missionId ?? body.missionId;

    // Fetch user roles in the mission
    const userToMission = await this.missionsService.findUserMissionRole(
      user.id,
      missionId,
    );

    // Check if any of the user's roles match the required roles for the route
    return missionRoles.includes(userToMission?.role as Role);
  }
}
