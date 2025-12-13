import { PartialType } from '@nestjs/mapped-types';
import { Constraint } from '../entities/constraint.entity';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateConstraintDto extends PartialType(Constraint) {
  userId: User['id'];
}
