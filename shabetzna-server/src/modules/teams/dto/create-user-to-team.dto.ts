import { PartialType } from '@nestjs/mapped-types';
import { UserToTeam } from '../entities/user-team.entity';

export class CreateUserToTeamDto extends PartialType(UserToTeam) {}
