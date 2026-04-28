import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'johndoe',
    phone: '1234567890',
  } as any;

  const mockUsers: User[] = [mockUser];

  const mockRequest = {
    user: { id: 'user-1', teamId: 'team-1' },
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
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
    it('should return all users', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the current user', async () => {
      const result = await controller.findOne(mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('user-1');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        phone: '9876543210',
      };

      const result = await controller.create(
        mockRequest as any,
        createUserDto,
      );

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user,
        createUserDto,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 'user-1';
      const updateUserDto: UpdateUserDto = { username: 'updated' };

      const result = await controller.update(
        mockRequest as any,
        id,
        updateUserDto,
      );

      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user,
        id,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 'user-1';

      await controller.remove(mockRequest as any, id);

      expect(service.remove).toHaveBeenCalledWith(mockRequest.user, id);
    });
  });
});
