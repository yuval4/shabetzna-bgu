import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { UserToMission } from './entities/user-mission.entity';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission]),
    TypeOrmModule.forFeature([UserToMission]),
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [TypeOrmModule, MissionsService],
})
export class MissionsModule { }