import { User } from 'src/modules/users/entities/user.entity';
import { AllocateShiftType } from '../types/types';

export class AllocateShiftsDto {
  userIds: User['id'][];
  shiftsType: AllocateShiftType;
  start: Date;
  end: Date;
  usersPerShift: number;
}
