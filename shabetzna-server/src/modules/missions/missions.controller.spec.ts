import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

describe('MissionsController', () => {
  let controller: MissionsController;
  let service: MissionsService;

  const mockMission = {
    id: 'mission-1',
    name: 'Mission Alpha',
    description: 'Test mission',
    teamId: 'team-1',
  } as any;

  const mockMissions: Mission[] = [mockMission];

  const mockUsers = [{ id: 'user-1', email: 'user@example.com' }];

  const mockRequest = {
    user: { id: 'user-1', teamId: 'team-1' },
  };

  const mockMissionsService = {
    findAll: jest.fn().mockResolvedValue(mockMissions),
    findOne: jest.fn().mockResolvedValue(mockMission),
    findUsers: jest.fn().mockResolvedValue(mockUsers),
    create: jest.fn().mockResolvedValue(mockMission),
    update: jest.fn().mockResolvedValue(mockMission),
    addUser: jest.fn().mockResolvedValue(undefined),
    addTeam: jest.fn().mockResolvedValue(mockMission),
    removeUser: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionsController],
      providers: [
        {
          provide: MissionsService,
          useValue: mockMissionsService,
        },
      ],
    }).compile();

    controller = module.get<MissionsController>(MissionsController);
    service = module.get<MissionsService>(MissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all missions', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockMissions);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a mission by id', async () => {
      const result = await controller.findOne('mission-1');

      expect(result).toEqual(mockMission);
      expect(service.findOne).toHaveBeenCalledWith('mission-1');
    });
  });

  describe('users', () => {
    it('should return users in a mission', async () => {
      const result = await controller.users('mission-1');

      expect(result).toEqual(mockUsers);
      expect(service.findUsers).toHaveBeenCalledWith('mission-1');
    });
  });

  describe('create', () => {
    it('should create a new mission', async () => {
      const createMissionDto = {
        name: 'New Mission',
        description: 'Test mission',
      } as any;

      const result = await controller.create(
        mockRequest as any,
        createMissionDto,
      );

      expect(result).toEqual(mockMission);
      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user,
        createMissionDto,
      );
    });
  });

  describe('update', () => {
    it('should update a mission', async () => {
      const id = 'mission-1';
      const updateMissionDto: UpdateMissionDto = { name: 'Updated Mission' };

      const result = await controller.update(
        mockRequest as any,
        id,
        updateMissionDto,
      );

      expect(result).toEqual(mockMission);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user,
        id,
        updateMissionDto,
      );
    });
  });

  describe('addUser', () => {
    it('should add a user to a mission', async () => {
      const createUserToMissionDto = {
        missionId: 'mission-1',
        userId: 'user-1',
        role: 'MEMBER',
      } as any;

      await controller.addUser(mockRequest as any, createUserToMissionDto);

      expect(service.addUser).toHaveBeenCalledWith(
        mockRequest.user,
        createUserToMissionDto,
      );
    });
  });

  describe('addTeam', () => {
    it('should add a team to a mission', async () => {
      const missionId = 'mission-1';

      const result = await controller.addTeam(mockRequest as any, missionId);

      expect(result).toEqual(mockMission);
      expect(service.addTeam).toHaveBeenCalledWith(mockRequest.user, missionId);
    });
  });

  describe('removeUser', () => {
    it('should remove a user from a mission', async () => {
      const missionId = 'mission-1';
      const userId = 'user-1';

      await controller.removeUser(
        mockRequest as any,
        missionId,
        userId,
      );

      expect(service.removeUser).toHaveBeenCalledWith(
        mockRequest.user,
        missionId,
        userId,
      );
    });
  });

  describe('remove', () => {
    it('should remove a mission', async () => {
      const id = 'mission-1';

      await controller.remove(mockRequest as any, id);

      expect(service.remove).toHaveBeenCalledWith(mockRequest.user, id);
    });
  });
});
