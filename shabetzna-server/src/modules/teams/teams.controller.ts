import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../auth/consts/role.enum';
import { Public } from '../auth/guards/jwt.guard';
import { TeamRoles } from '../auth/roles/team-roles.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateUserToTeamDto } from './dto/create-user-to-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) { }

  // TODO - public only if not using google auth
  @Public()
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  // TODO - public only if not using google auth
  @Public()
  @Get(':id/users')
  users(@Param('id') id: string) {
    return this.teamsService.findUsers(id);
  }

  @Get(':id/justice')
  async justice(@Param('id') id: string) {
    return this.teamsService.findUsersWithJustice(id);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post()
  create(@Req() req: Request, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(req.user, createTeamDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(req.user, id, updateTeamDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post('users')
  addUser(
    @Req() req: Request,
    @Body() createUserToTeamDto: CreateUserToTeamDto,
  ) {
    this.teamsService.addUser(req.user, createUserToTeamDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':teamId/users/:userId')
  removeUser(
    @Req() req: Request,
    @Param('teamId') teamId: Team['id'],
    @Param('userId') userId: User['id'],
  ) {
    return this.teamsService.removeUser(req.user, teamId, userId);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: Team['id']) {
    return this.teamsService.remove(req.user, id);
  }
}
