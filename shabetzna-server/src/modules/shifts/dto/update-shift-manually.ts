import { Shift } from '../entities/shift.entity';
import { UpdateShiftDto } from './update-shift.dto';

export class UpdateShiftsManuallyDto {
  shifts: UpdateShiftDto[];
  shiftsIdsToDelete: Shift['id'][];
}
