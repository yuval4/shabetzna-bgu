import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../auth/consts/role.enum';
import { TeamRoles } from '../auth/roles/team-roles.decorator';
import { Team } from '../teams/entities/team.entity';
import { ConstraintService } from './constraint.service';
import { CreateConstraintDto } from './dto/create-constraint.dto';
import { UpdateConstraintDto } from './dto/update-constraint.dto';
import { Constraint } from './entities/constraint.entity';

@Controller('constraints')
export class ConstraintController {
  constructor(private readonly constraintService: ConstraintService) { }

  @Get(':id')
  findOne(@Param('id') id: Constraint['id']) {
    return this.constraintService.findOne(id);
  }

  @Get('team/:teamId/:start/:end')
  constraintByTeamAndRange(
    @Param('teamId') teamId: Team['id'],
    @Param('start') start: Date,
    @Param('end') end: Date,
  ) {
    return this.constraintService.constraintByTeamAndRange(teamId, start, end);
  }

  @Put()
  upsert(
    @Req() req: Request,
    @Body() createConstraintDto: CreateConstraintDto,
  ) {
    return this.constraintService.upsert(req.user, createConstraintDto);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: Constraint['id'],
    @Body() updateConstraintDto: UpdateConstraintDto,
  ) {
    return this.constraintService.update(req.user, id, updateConstraintDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Put(':id/approve')
  approve(@Req() req: Request, @Param('id') id: Constraint['id']) {
    return this.constraintService.update(req.user, id, { status: 'APPROVED' });
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Put(':id/reject')
  reject(@Req() req: Request, @Param('id') id: Constraint['id']) {
    return this.constraintService.update(req.user, id, { status: 'REJECTED' });
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: Constraint['id']) {
    return this.constraintService.remove(req.user, id);
  }
}
