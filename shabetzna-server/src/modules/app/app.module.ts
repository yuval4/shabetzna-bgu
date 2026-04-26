import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TeamRolesGuard } from '../auth/guards/team-roles.guard';
import { ConstraintModule } from '../constraint/constraint.module';
import { DatabaseModule } from '../database/database.module';
import { MissionsModule } from '../missions/missions.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { TeamsModule } from '../teams/teams.module';
import { UnitsModule } from '../units/units.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TeamsModule,
    UnitsModule,
    ConstraintModule,
    ShiftsModule,
    MissionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TeamRolesGuard,
    },
  ],
})
export class AppModule { }
