import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ConstraintService } from '../../../modules/constraint/constraint.service';
import { MissionsService } from '../../../modules/missions/missions.service';
import { TeamsService } from '../../../modules/teams/teams.service';
import { MissionRole } from '../consts/mission-role.enum';
import { TeamRole } from '../consts/team-role.enum';
import { MISSION_ROLES_KEY } from '../roles/mission-roles.decorator';

@Injectable()
export class MissionRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private missionsService: MissionsService,
    private teamsService: TeamsService,
    private constraintService: ConstraintService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const missionRoles = this.reflector.get<MissionRole[]>(MISSION_ROLES_KEY, context.getHandler());

    if (!missionRoles || missionRoles.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const { user, params, body } = request;
    let missionId = params.missionId ?? body.missionId;

    if (!missionId && params.id && context.getClass().name === 'ConstraintController') {
      const constraint = await this.constraintService.findOne(params.id);
      missionId = constraint.missionId;
    }

    // Fetch user roles in the mission
    const userToMission = await this.missionsService.findUserMissionRole(
      user.id,
      missionId,
    );

    // Check if any of the user's roles match the required roles for the route
    if (missionRoles.includes(userToMission?.role as MissionRole)) {
      return true;
    }

    // If user has TEAM_LEADER role in the team of the mission, allow access
    const userToTeam = await this.teamsService.findUserTeamRole(
      user.id,
      userToMission.mission.teamId,
    );

    return TeamRole.TEAM_LEADER === userToTeam?.role as TeamRole;
  }
}
