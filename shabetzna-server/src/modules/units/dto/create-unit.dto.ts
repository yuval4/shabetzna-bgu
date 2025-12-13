import { PartialType } from '@nestjs/mapped-types';
import { Unit } from '../entities/unit.entity';

export class CreateUnitDto extends PartialType(Unit) {}
