import { Test, TestingModule } from '@nestjs/testing';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeam = {
    id: 'team-1',
    name: 'Team Alpha',
    description: 'Test team',
  } as any;

  const mockTeams: Team[] = [mockTeam];

  const mockUsers = [{ id: 'user-1', email: 'user@example.com' }];

  const mockUsersWithJustice = [
    { id: 'user-1', email: 'user@example.com', justice: 'APPROVED' },
  ];

  const mockRequest = {
    user: { id: 'user-1', teamId: 'team-1' },
  };

  const mockTeamsService = {
    findAll: jest.fn().mockResolvedValue(mockTeams),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    findUsers: jest.fn().mockResolvedValue(mockUsers),
    findUsersWithJustice: jest.fn().mockResolvedValue(mockUsersWithJustice),
    create: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue(mockTeam),
    addUser: jest.fn().mockResolvedValue(undefined),
    removeUser: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
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
    it('should return all teams', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockTeams);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a team by id', async () => {
      const result = await controller.findOne('team-1');

      expect(result).toEqual(mockTeam);
      expect(service.findOne).toHaveBeenCalledWith('team-1');
    });
  });

  describe('users', () => {
    it('should return users in a team', async () => {
      const result = await controller.users('team-1');

      expect(result).toEqual(mockUsers);
      expect(service.findUsers).toHaveBeenCalledWith('team-1');
    });
  });

  describe('justice', () => {
    it('should return users with justice info', async () => {
      const result = await controller.justice('team-1');

      expect(result).toEqual(mockUsersWithJustice);
      expect(service.findUsersWithJustice).toHaveBeenCalledWith('team-1');
    });
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'New Team',
        description: 'Test team',
      };

      const result = await controller.create(
        mockRequest as any,
        createTeamDto,
      );

      expect(result).toEqual(mockTeam);
      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user,
        createTeamDto,
      );
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const id = 'team-1';
      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };

      const result = await controller.update(
        mockRequest as any,
        id,
        updateTeamDto,
      );

      expect(result).toEqual(mockTeam);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user,
        id,
        updateTeamDto,
      );
    });
  });

  describe('addUser', () => {
    it('should add a user to a team', async () => {
      const createUserToTeamDto = {
        teamId: 'team-1',
        userId: 'user-1',
      };

      await controller.addUser(mockRequest as any, createUserToTeamDto);

      expect(service.addUser).toHaveBeenCalledWith(
        mockRequest.user,
        createUserToTeamDto,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user from a team', async () => {
      const teamId = 'team-1';
      const userId = 'user-1';

      await controller.removeUser(
        mockRequest as any,
        teamId,
        userId,
      );

      expect(service.removeUser).toHaveBeenCalledWith(
        mockRequest.user,
        teamId,
        userId,
      );
    });
  });

  describe('remove', () => {
    it('should remove a team', async () => {
      const id = 'team-1';

      await controller.remove(mockRequest as any, id);

      expect(service.remove).toHaveBeenCalledWith(mockRequest.user, id);
    });
  });
});
