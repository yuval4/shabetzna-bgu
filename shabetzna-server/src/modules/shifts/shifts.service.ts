import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Between, In, IsNull, Repository } from 'typeorm';
import { UserMetadata } from '../../types';
import { dateWithoutTime } from '../../utils/dates/date-without-time';
import { getDatesBetween } from '../../utils/dates/get-dates-between';
import { ConstraintService } from '../constraint/constraint.service';
import { Mission } from '../missions/entities/mission.entity';
import { Unit } from '../units/entities/unit.entity';
import { User } from '../users/entities/user.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { AllocateShiftType } from './types/types';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    private constraintService: ConstraintService,
  ) { }

  async spartaView(
    unitId: Unit['id'],
    start: Date,
    end: Date,
  ): Promise<Shift[]> {
    return await this.shiftRepository.find({
      where: {
        date: Between(start, end),
        mission: {
          team: {
            unitId,
          },
        },
      },
      relations: {
        assignedUser: true,
        mission: true,
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async missionShifts(
    missionId: Mission['id'],
    start: Date,
    end: Date,
  ): Promise<Shift[]> {
    return await this.shiftRepository.find({
      where: {
        missionId,
        date: Between(start, end),
      },
      relations: {
        assignedUser: true,
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async missionShiftsForAlgorithm(missionId: Mission['id']): Promise<Shift[]> {
    return await this.shiftRepository.find({
      where: {
        missionId,
      },
      select: ['id', 'date', 'assignedUserId', 'shiftType', 'isReadiness'],
      order: {
        date: 'ASC',
      },
    });
  }

  async allocateShifts(
    user: UserMetadata,
    missionId: Mission['id'],
    userIds: User['id'][],
    range: { start: Date; end: Date },
    shiftsType: AllocateShiftType = AllocateShiftType.FULL_DAY,
    usersPerShift: number = 1,
  ): Promise<void> {
    const shiftsDates = getDatesBetween(range.start, range.end);

    const constraints =
      await this.constraintService.approvedConstraintByMissionAndRange(
        missionId,
        range.start,
        range.end,
      );

    try {
      const prevShifts = await this.missionShiftsForAlgorithm(missionId);
      const algorithmData = {
        userIds,
        shiftsDates,
        shiftsType,
        constraints: constraints.map((constraint) => ({
          userId: constraint.user.id,
          type: constraint.type,
          date: dateWithoutTime(new Date(constraint.date)),
        })),
        usersPerShift,
        prevShifts,
      };
      const allocatedShifts = await axios({
        method: 'post',
        url: process.env.ALGORITHM_URL,
        data: algorithmData,
      });

      // TODO delete
      console.log({ algorithmData });

      await this.shiftRepository.manager.transaction(async (manager) => {
        const userShifts = allocatedShifts.data.map((shift) => {
          return manager.create(Shift, {
            date: new Date(shift.date),
            missionId,
            assignedUser: { id: shift.userId },
            shiftType: shift.shiftType,
            createdBy: user,
            updatedBy: user,
          });
        });

        await Promise.all(
          userShifts.map((userShift) => this.shiftRepository.save(userShift)),
        );
      });
    } catch (error) {
      throw Error(error as string);
    }
  }

  async updateShiftsManually(
    user: UserMetadata,
    shifts: Partial<Shift>[],
    shiftsIdsToDelete: Shift['id'][],
  ): Promise<void> {
    await this.shiftRepository.manager.transaction(async (manager) => {
      const existsShiftIds = shifts.map((shift) => shift.id).filter(Boolean);

      const shiftsToUpdate = await manager.find(Shift, {
        where: {
          id: In(existsShiftIds),
        },
        relations: ['assignedUser', 'createdBy', 'updatedBy'],
        select: [
          'id',
          'missionId',
          'date',
          'comment',
          'shiftType',
          'assignedUser',
          'isVacation',
          'isHoliday',
          'hasAfter',
          'isReadiness',
          'bonus',
          'deletedAt',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
        ],
      });

      await manager.update(
        Shift,
        {
          id: In(shiftsIdsToDelete),
          deletedAt: IsNull(),
        },
        { deletedAt: new Date(), updatedBy: user },
      );

      await manager.update(
        Shift,
        {
          id: In(existsShiftIds),
          deletedAt: IsNull(),
        },
        { deletedAt: new Date() },
      );

      const mergedShifts = shifts.map((shift) => {
        const existingShift = shiftsToUpdate.find((s) => s.id === shift.id);
        if (existingShift) {
          return {
            ...existingShift,
            ...shift,
            updatedBy: user,
            deletedAt: null,
          };
        } else {
          return {
            ...shift,
            updatedBy: user,
            createdBy: user,
            deletedAt: null,
          };
        }
      });

      await manager.getRepository(Shift).insert(mergedShifts);
    });
  }

  async create(
    user: UserMetadata,
    createShiftDto: CreateShiftDto,
  ): Promise<Shift> {
    return await this.shiftRepository.save({
      createdBy: user,
      updatedBy: user,
      ...createShiftDto,
    });
  }

  async update(
    user: UserMetadata,
    id: Shift['id'],
    updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id } });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    await this.shiftRepository.update(
      { id },
      {
        updatedBy: user,
        ...updateShiftDto,
      },
    );
    return shift;
  }

  async remove(user: UserMetadata, id: Shift['id']): Promise<void> {
    await this.shiftRepository.softDelete({ id });
  }
}
