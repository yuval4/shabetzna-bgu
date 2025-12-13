import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles/roles.decorator';
import { Role } from '../consts/role.enum';
import { TeamsService } from 'src/modules/teams/teams.service';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private teamsService: TeamsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
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
    return roles.includes(userToTeam?.role as Role);
  }
}
