import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserToTeam } from './entities/user-team.entity';
import { CreateUserToTeamDto } from './dto/create-user-to-team.dto';
import { UserMetadata } from 'src/types';
import { Role } from '../auth/consts/role.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(UserToTeam)
    private userToTeamRepository: Repository<UserToTeam>,
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async findUserTeamRole(
    userId: string,
    teamId: string,
  ): Promise<UserToTeam | null> {
    return this.userToTeamRepository.findOne({
      where: { userId, teamId },
    });
  }

  // remove this method
  async findUsersAndData(id: Team['id']): Promise<Team> {
    return await this.teamRepository.findOne({
      where: { id },
      // relations: {
      //   users: {
      //     shifts: true,
      //     constraints: true,
      //   },
      // },
      select: {
        // users: {
        //   id: true,
        //   points: true,
        // },
      },
    });
  }

  async findOne(id: Team['id']): Promise<Team> {
    return await this.teamRepository.findOne({
      where: { id },
    });
  }

  async findUsers(id: Team['id']): Promise<UserToTeam[]> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: {
        users: {
          user: true,
        },
      },
    });

    return team.users;
  }

  async findUsersWithJustice(id: Team['id']): Promise<UserToTeam[]> {
    const users = await this.userToTeamRepository.find({
      where: { teamId: id },
      select: {
        user: {
          username: true,
          points: {
            weekday: true,
            thursday: true,
            friday: true,
            saturday: true,
            readiness: true,
            total: true,
          },
        },
      },
      relations: {
        user: {
          points: true,
        },
      },
    });

    return users;
  }

  async create(
    user: UserMetadata,
    createTeamDto: CreateTeamDto,
  ): Promise<Team> {
    return await this.teamRepository.manager.transaction(async (manager) => {
      const newTeam = await manager.save(Team, {
        createdBy: user,
        updatedBy: user,
        ...createTeamDto,
      });

      await manager.save(UserToTeam, {
        createdBy: user,
        updatedBy: user,
        user: user,
        role: Role.TEAM_LEADER,
        teamId: newTeam.id,
      });

      return newTeam;
    });
  }

  async update(
    user: UserMetadata,
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team not found');
    }
    await this.teamRepository.update(
      { id },
      {
        updatedBy: user,
        ...updateTeamDto,
      },
    );
    return team;
  }

  async addUser(
    user: UserMetadata,
    createUserToTeamDto: CreateUserToTeamDto,
  ): Promise<void> {
    await this.userToTeamRepository.save({
      createdBy: user,
      updatedBy: user,
      ...createUserToTeamDto,
    });
  }

  async removeUser(
    user: UserMetadata,
    teamId: Team['id'],
    userId: User['id'],
  ): Promise<void> {
    await this.userToTeamRepository.softDelete({
      teamId,
      userId,
      deletedAt: IsNull(),
    });
  }

  async remove(user: UserMetadata, id: Team['id']): Promise<void> {
    await this.teamRepository.softDelete({ id });
  }
}
