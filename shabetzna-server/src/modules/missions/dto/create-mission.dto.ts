import { PartialType } from '@nestjs/mapped-types';
import { Mission } from '../entities/mission.entity';

export class CreateMissionDto extends PartialType(Mission) {}
