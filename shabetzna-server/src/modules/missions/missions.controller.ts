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
import { CreateMissionDto } from './dto/create-mission.dto';
import { CreateUserToMissionDto } from './dto/create-user-to-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) { }

  // TODO - public only if not using google auth
  @Public()
  @Get()
  findAll() {
    return this.missionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  // TODO - public only if not using google auth
  @Public()
  @Get(':id/users')
  users(@Param('id') id: string) {
    return this.missionsService.findUsers(id);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post()
  create(@Req() req: Request, @Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(req.user, createMissionDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    return this.missionsService.update(req.user, id, updateMissionDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post('users')
  addUser(
    @Req() req: Request,
    @Body() createUserToMissionDto: CreateUserToMissionDto,
  ) {
    this.missionsService.addUser(req.user, createUserToMissionDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post('team')
  addTeam(@Req() req: Request, @Body('missionId') missionId: Mission['id']) {
    return this.missionsService.addTeam(req.user, missionId);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':missionId/users/:userId')
  removeUser(
    @Req() req: Request,
    @Param('missionId') missionId: Mission['id'],
    @Param('userId') userId: User['id'],
  ) {
    return this.missionsService.removeUser(req.user, missionId, userId);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: Mission['id']) {
    return this.missionsService.remove(req.user, id);
  }
}
