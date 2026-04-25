import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UserMetadata } from '../../types';
import { Mission } from '../missions/entities/mission.entity';
import { CreateConstraintDto } from './dto/create-constraint.dto';
import { UpdateConstraintDto } from './dto/update-constraint.dto';
import { Constraint } from './entities/constraint.entity';

@Injectable()
export class ConstraintService {
  constructor(
    @InjectRepository(Constraint)
    private constraintRepository: Repository<Constraint>,
  ) { }

  async upsert(
    user: UserMetadata,
    createConstraintDto: CreateConstraintDto,
  ): Promise<Constraint> {
    return await this.constraintRepository.save({
      user: { id: createConstraintDto.userId },
      mission: { id: createConstraintDto.missionId },
      createdBy: user,
      updatedBy: user,
      ...createConstraintDto,
    });
  }

  async constraintByMissionAndRange(
    missionId: Mission['id'],
    start: Date,
    end: Date,
  ): Promise<Constraint[]> {
    return await this.constraintRepository.find({
      where: {
        missionId,
        date: Between(start, end),
      },
      relations: {
        user: true,
        mission: true,
      },
      order: {
        date: 'ASC',
        id: 'ASC',
      },
    });
  }

  async approvedConstraintByMissionAndRange(
    missionId: Mission['id'],
    start: Date,
    end: Date,
  ): Promise<Constraint[]> {
    return await this.constraintRepository.find({
      where: {
        missionId,
        date: Between(start, end),
        status: 'APPROVED',
      },
      relations: {
        user: true,
        mission: true,
      },
      order: {
        date: 'ASC',
        id: 'ASC',
      },
    });
  }

  async findOne(id: Constraint['id']): Promise<Constraint> {
    return await this.constraintRepository.findOne({ where: { id } });
  }

  async update(
    user: UserMetadata,
    id: Constraint['id'],
    updateConstraintDto: UpdateConstraintDto,
  ): Promise<Constraint> {
    const constraint = await this.constraintRepository.findOne({
      where: { id },
    });

    if (!constraint) {
      throw new NotFoundException('Constraint not found');
    }

    await this.constraintRepository.update(
      { id },
      {
        updatedBy: user,
        ...updateConstraintDto,
      },
    );

    return constraint;
  }

  async remove(_user: UserMetadata, id: Constraint['id']): Promise<void> {
    await this.constraintRepository.softDelete({ id });
  }
}
