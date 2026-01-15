import { PartialType } from '@nestjs/mapped-types';
import { UserToMission } from '../entities/user-mission.entity';

export class CreateUserToMissionDto extends PartialType(UserToMission) {}