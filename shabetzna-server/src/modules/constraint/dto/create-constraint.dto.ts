import { PartialType } from '@nestjs/mapped-types';
import { Mission } from '../../missions/entities/mission.entity';
import { User } from '../../users/entities/user.entity';
import { Constraint } from '../entities/constraint.entity';

export class CreateConstraintDto extends PartialType(Constraint) {
  userId: User['id'];
  missionId: Mission['id'];
}
