import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/roles/roles.decorator'
import { Role } from '../auth/consts/role.enum';
import { Team } from '../teams/entities/team.entity';
import { AllocateShiftsDto } from './dto/allocate-shifts.dto';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';
import { UpdateShiftsManuallyDto } from './dto/update-shift-manually';
import { Unit } from '../units/entities/unit.entity';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('sparta/:unitId/:start/:end')
  sparta(
    @Param('unitId') unitId: Unit['id'],
    @Param('start') start: Date,
    @Param('end') end: Date,
  ) {
    return this.shiftsService.spartaView(unitId, start, end);
  }

  @Get('team/:teamId/week/:start/:end')
  teamShifts(
    @Param('teamId') teamId: Team['id'],
    @Param('start') start: Date,
    @Param('end') end: Date,
  ): Promise<Shift[]> {
    return this.shiftsService.teamShifts(teamId, start, end);
  }

  @Roles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Patch(':id')
  updateById(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    return this.shiftsService.update(req.user, id, updateShiftDto);
  }

  @Roles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post()
  create(
    @Req() req: Request,
    @Body() createShiftDto: CreateShiftDto,
  ): Promise<Shift> {
    return this.shiftsService.create(req.user, createShiftDto);
  }

  @Roles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post('allocate/team/:teamId')
  async allocate(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Body() body: AllocateShiftsDto,
  ): Promise<void> {
    return await this.shiftsService.allocateShifts(
      req.user,
      teamId,
      body.userIds,
      {
        start: body.start,
        end: body.end,
      },
      body.shiftsType,
      body.usersPerShift,
    );
  }

  @Roles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Put()
  async updateShifts(
    @Req() req: Request,
    @Body() body: UpdateShiftsManuallyDto,
  ): Promise<void> {
    return await this.shiftsService.updateShiftsManually(
      req.user,
      body.shifts,
      body.shiftsIdsToDelete,
    );
  }

  @Roles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    return this.shiftsService.remove(req.user, id);
  }
}
