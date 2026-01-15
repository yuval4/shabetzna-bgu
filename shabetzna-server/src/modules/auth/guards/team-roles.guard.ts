import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TeamsService } from '../../teams/teams.service';
import { Role } from '../consts/role.enum';
import { TEAM_ROLES_KEY } from '../roles/team-roles.decorator';

@Injectable()
export class TeamRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private teamsService: TeamsService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const teamRoles = this.reflector.get<Role[]>(TEAM_ROLES_KEY, context.getHandler());

    if (!teamRoles || teamRoles.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const { user, params, body } = request;
    const teamId = params.teamId ?? body.teamId;

    // Fetch user roles in the team
    const userToTeam = await this.teamsService.findUserTeamRole(
      user.id,
      teamId,
    );

    // Check if any of the user's roles match the required roles for the route
    return teamRoles.includes(userToTeam?.role as Role);
  }
}
