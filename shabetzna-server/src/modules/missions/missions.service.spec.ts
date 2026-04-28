import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { UserToMission } from './entities/user-mission.entity';
import { MissionsService } from './missions.service';

describe('MissionsService', () => {
  let service: MissionsService;
  const mockMissionRepository = {};
  const mockUserToMissionRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        {
          provide: getRepositoryToken(Mission),
          useValue: mockMissionRepository,
        },
        {
          provide: getRepositoryToken(UserToMission),
          useValue: mockUserToMissionRepository,
        },
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
