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
import { MissionRole } from '../auth/consts/mission-role.enum';
import { MissionRoles } from '../auth/roles/mission-roles.decorator';
import { Mission } from '../missions/entities/mission.entity';
import { Unit } from '../units/entities/unit.entity';
import { AllocateShiftsDto } from './dto/allocate-shifts.dto';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftsManuallyDto } from './dto/update-shift-manually';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Get('sparta/:unitId/:start/:end')
  sparta(
    @Param('unitId') unitId: Unit['id'],
    @Param('start') start: Date,
    @Param('end') end: Date,
  ) {
    return this.shiftsService.spartaView(unitId, start, end);
  }

  @Get('missions/:missionId/week/:start/:end')
  missionShifts(
    @Param('missionId') missionId: Mission['id'],
    @Param('start') start: Date,
    @Param('end') end: Date,
  ): Promise<Shift[]> {
    return this.shiftsService.missionShifts(missionId, start, end);
  }

  @MissionRoles(MissionRole.MISSION_ADMIN)
  @Patch(':id')
  updateById(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    return this.shiftsService.update(req.user, id, updateShiftDto);
  }

  @MissionRoles(MissionRole.MISSION_ADMIN)
  @Post()
  create(
    @Req() req: Request,
    @Body() createShiftDto: CreateShiftDto,
  ): Promise<Shift> {
    return this.shiftsService.create(req.user, createShiftDto);
  }

  @MissionRoles(MissionRole.MISSION_ADMIN)
  @Post('allocate/mission/:missionId')
  async allocate(
    @Req() req: Request,
    @Param('missionId') missionId: Mission['id'],
    @Body() body: AllocateShiftsDto,
  ): Promise<void> {
    return await this.shiftsService.allocateShifts(
      req.user,
      missionId,
      body.userIds,
      {
        start: body.start,
        end: body.end,
      },
      body.shiftsType,
      body.usersPerShift,
    );
  }

  @MissionRoles(MissionRole.MISSION_ADMIN)
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

  @MissionRoles(MissionRole.MISSION_ADMIN)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    return this.shiftsService.remove(req.user, id);
  }
}
