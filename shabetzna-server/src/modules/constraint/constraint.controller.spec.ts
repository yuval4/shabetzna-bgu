import { Test, TestingModule } from '@nestjs/testing';
import { ConstraintController } from './constraint.controller';
import { ConstraintService } from './constraint.service';
import { CreateConstraintDto } from './dto/create-constraint.dto';
import { UpdateConstraintDto } from './dto/update-constraint.dto';
import { Constraint } from './entities/constraint.entity';

describe('ConstraintController', () => {
  let controller: ConstraintController;
  let service: ConstraintService;

  const mockConstraint = {
    id: 'constraint-1',
    userId: 'user-1',
    missionId: 'mission-1',
    type: 'UNAVAILABLE',
    date: new Date(),
    reason: 'Not available',
  } as any;

  const mockConstraints: Constraint[] = [mockConstraint];

  const mockRequest = {
    user: { id: 'user-1', teamId: 'team-1' },
  };

  const mockConstraintService = {
    findOne: jest.fn().mockResolvedValue(mockConstraint),
    constraintByMissionAndRange: jest.fn().mockResolvedValue(mockConstraints),
    upsert: jest.fn().mockResolvedValue(mockConstraint),
    update: jest.fn().mockResolvedValue(mockConstraint),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstraintController],
      providers: [
        {
          provide: ConstraintService,
          useValue: mockConstraintService,
        },
      ],
    }).compile();

    controller = module.get<ConstraintController>(ConstraintController);
    service = module.get<ConstraintService>(ConstraintService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a constraint by id', async () => {
      const result = await controller.findOne('constraint-1');

      expect(result).toEqual(mockConstraint);
      expect(service.findOne).toHaveBeenCalledWith('constraint-1');
    });
  });

  describe('constraintByMissionAndRange', () => {
    it('should return constraints for a mission in a date range', async () => {
      const missionId = 'mission-1';
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');

      const result = await controller.constraintByMissionAndRange(
        missionId,
        start,
        end,
      );

      expect(result).toEqual(mockConstraints);
      expect(service.constraintByMissionAndRange).toHaveBeenCalledWith(
        missionId,
        start,
        end,
      );
    });
  });

  describe('upsert', () => {
    it('should upsert a constraint', async () => {
      const createConstraintDto: CreateConstraintDto = {
        userId: 'user-1',
        missionId: 'mission-1',
        type: 'UNAVAILABLE',
        date: new Date(),
        reason: 'Not available',
      };

      const result = await controller.upsert(
        mockRequest as any,
        createConstraintDto,
      );

      expect(result).toEqual(mockConstraint);
      expect(service.upsert).toHaveBeenCalledWith(
        mockRequest.user,
        createConstraintDto,
      );
    });
  });

  describe('update', () => {
    it('should update a constraint', async () => {
      const id = 'constraint-1';
      const updateConstraintDto: UpdateConstraintDto = { status: 'APPROVED' };

      const result = await controller.update(
        mockRequest as any,
        id,
        updateConstraintDto,
      );

      expect(result).toEqual(mockConstraint);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user,
        id,
        updateConstraintDto,
      );
    });
  });

  describe('approve', () => {
    it('should approve a constraint', async () => {
      const id = 'constraint-1';

      const result = await controller.approve(mockRequest as any, id);

      expect(result).toEqual(mockConstraint);
      expect(service.update).toHaveBeenCalledWith(mockRequest.user, id, {
        status: 'APPROVED',
      });
    });
  });

  describe('reject', () => {
    it('should reject a constraint', async () => {
      const id = 'constraint-1';

      const result = await controller.reject(mockRequest as any, id);

      expect(result).toEqual(mockConstraint);
      expect(service.update).toHaveBeenCalledWith(mockRequest.user, id, {
        status: 'REJECTED',
      });
    });
  });

  describe('remove', () => {
    it('should remove a constraint', async () => {
      const id = 'constraint-1';

      await controller.remove(mockRequest as any, id);

      expect(service.remove).toHaveBeenCalledWith(mockRequest.user, id);
    });
  });
});
