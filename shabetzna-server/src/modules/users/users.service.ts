import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { UserMetadata } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: User['id']): Promise<User> {
    const user = await this.userRepository.find({
      where: { id },
      relations: {
        teams: {
          team: true,
        },
      },
      select: {
        id: true,
        username: true,
        phone: true,
        teams: {
          role: true,
          createdAt: true,
        },
      },
      order: {
        teams: {
          team: {
            createdAt: 'ASC',
          },
        },
      },
    });

    if (!user || user.length === 0) {
      throw new NotFoundException('User not found');
    }

    return user[0];
  }

  async findOneByEmail(email: User['email']): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: ILike(email.trim()) },
    });
  }

  async create(
    user: UserMetadata,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userRepository.save({
      createdBy: user,
      updatedBy: user,
      ...createUserDto,
    });
  }

  async update(
    user: UserMetadata,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(
      { id },
      {
        updatedBy: user,
        ...updateUserDto,
      },
    );
    return userToUpdate;
  }

  async remove(user: UserMetadata, id: User['id']): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
