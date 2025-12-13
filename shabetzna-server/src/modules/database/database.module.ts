//src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        namingStrategy: new SnakeNamingStrategy(),
        type: 'postgres',
        url: configService.get('POSTGRES_URL'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
