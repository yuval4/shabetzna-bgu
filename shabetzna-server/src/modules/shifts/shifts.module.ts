import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstraintModule } from '../constraint/constraint.module';
import { Shift } from './entities/shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), ConstraintModule],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [TypeOrmModule],
})
export class ShiftsModule {}
