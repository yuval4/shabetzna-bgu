import { PartialType } from '@nestjs/mapped-types';
import { Shift } from '../entities/shift.entity';

export class CreateShiftDto extends PartialType(Shift) {}
