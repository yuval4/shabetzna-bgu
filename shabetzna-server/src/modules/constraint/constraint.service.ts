import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';
import { CreateConstraintDto } from './dto/create-constraint.dto';
import { UpdateConstraintDto } from './dto/update-constraint.dto';
import { Constraint } from './entities/constraint.entity';
import { UserMetadata } from '../../types'

@Injectable()
export class ConstraintService {
  constructor(
    @InjectRepository(Constraint)
    private constraintRepository: Repository<Constraint>,
  ) {}

  async upsert(
    user: UserMetadata,
    createConstraintDto: CreateConstraintDto,
  ): Promise<Constraint> {
    return await this.constraintRepository.save({
      user: { id: createConstraintDto.userId },
      createdBy: user,
      updatedBy: user,
      ...createConstraintDto,
    });
  }

  async constraintByTeamAndRange(
    teamId: Team['id'],
    start: Date,
    end: Date,
  ): Promise<Constraint[]> {
    return await this.constraintRepository.find({
      where: {
        user: {
          teams: {
            teamId,
          },
        },
        date: Between(start, end),
      },
      relations: {
        user: true,
      },
      order: {
        date: 'ASC',
        id: 'ASC',
      },
    });
  }

  async approvedConstraintByTeamAndRange(
    teamId: Team['id'],
    start: Date,
    end: Date,
  ): Promise<Constraint[]> {
    return await this.constraintRepository.find({
      where: {
        user: {
          teams: {
            teamId,
          },
        },
        date: Between(start, end),
        status: 'APPROVED',
      },
      relations: {
        user: true,
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
