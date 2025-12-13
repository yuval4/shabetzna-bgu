import { Module } from '@nestjs/common';
import { ConstraintService } from './constraint.service';
import { ConstraintController } from './constraint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constraint } from './entities/constraint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Constraint])],
  controllers: [ConstraintController],
  providers: [ConstraintService],
  exports: [TypeOrmModule, ConstraintService],
})
export class ConstraintModule {}
