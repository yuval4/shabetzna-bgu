import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../auth/consts/role.enum';
import { TeamRoles } from '../auth/roles/team-roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  findOne(@Req() req: Request): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Post()
  create(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(req.user, createUserDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Put('/:id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user, id, updateUserDto);
  }

  @TeamRoles(Role.SHIFTS_ADMIN, Role.TEAM_LEADER)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    return this.usersService.remove(req.user, id);
  }
}
