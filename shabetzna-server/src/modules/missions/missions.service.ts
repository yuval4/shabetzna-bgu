import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserMetadata } from '../../types';
import { Role } from '../auth/consts/role.enum';
import { User } from '../users/entities/user.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { CreateUserToMissionDto } from './dto/create-user-to-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { UserToMission } from './entities/user-mission.entity';
import { Team } from '../teams/entities/team.entity';
import { UserToTeam } from '../teams/entities/user-team.entity';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission) private missionRepository: Repository<Mission>,
    @InjectRepository(UserToMission)
    private userToMissionRepository: Repository<UserToMission>,
  ) { }

  async findAll(): Promise<Mission[]> {
    return await this.missionRepository.find();
  }

  async findUserMissionRole(
    userId: string,
    missionId: string,
  ): Promise<UserToMission | null> {
    return this.userToMissionRepository.findOne({
      where: { userId, missionId },
    });
  }


  async findOne(id: Mission['id']): Promise<Mission> {
    return await this.missionRepository.findOne({
      where: { id },
    });
  }

  async findUsers(id: Mission['id']): Promise<UserToMission[]> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: {
        users: {
          user: true,
        },
      },
    });

    return mission.users;
  }


  async create(
    user: UserMetadata,
    createMissionDto: CreateMissionDto,
  ): Promise<Mission> {
    return await this.missionRepository.manager.transaction(async (manager) => {
      const newMission = await manager.save(Mission, {
        createdBy: user,
        updatedBy: user,
        ...createMissionDto,
      });

      await manager.save(UserToMission, {
        createdBy: user,
        updatedBy: user,
        user: user,
        role: Role.TEAM_LEADER,
        missionId: newMission.id,
      });

      return newMission;
    });
  }

  async update(
    user: UserMetadata,
    id: string,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    await this.missionRepository.update(
      { id },
      {
        updatedBy: user,
        ...updateMissionDto,
      },
    );
    return mission;
  }

  async addUser(
    user: UserMetadata,
    createUserToMissionDto: CreateUserToMissionDto,
  ): Promise<void> {
    await this.userToMissionRepository.save({
      createdBy: user,
      updatedBy: user,
      ...createUserToMissionDto,
    });
  }

  async addTeam(user: UserMetadata, teamId: Team['id']): Promise<void> {
    await this.missionRepository.manager.transaction(async (manager) => {
      const teamUsers = await manager.getRepository(UserToTeam).find({
        where: {
          teamId,
          deletedAt: IsNull(),
        },
      });

      const userToMissions = teamUsers.map((userToTeam) => ({
        createdBy: user,
        updatedBy: user,
        userId: userToTeam.userId,
        role: userToTeam.role,
        teamId,
      }));

      await manager.save(UserToMission, userToMissions);
    });
  }

  async removeUser(
    user: UserMetadata,
    missionId: Mission['id'],
    userId: User['id'],
  ): Promise<void> {
    await this.userToMissionRepository.softDelete({
      missionId,
      userId,
      deletedAt: IsNull(),
    });
  }

  async remove(user: UserMetadata, id: Mission['id']): Promise<void> {
    await this.missionRepository.softDelete({ id });
  }
}
