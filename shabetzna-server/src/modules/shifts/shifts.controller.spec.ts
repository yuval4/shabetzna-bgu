import { Test, TestingModule } from '@nestjs/testing';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

describe('ShiftsController', () => {
  let controller: ShiftsController;
  let service: ShiftsService;

  const mockShift = {
    id: 'shift-1',
    missionId: 'mission-1',
  } as any;

  const mockShifts: Shift[] = [mockShift];

  const mockRequest = {
    user: { id: 'user-1', teamId: 'team-1' },
  };

  const mockShiftsService = {
    spartaView: jest.fn().mockResolvedValue(mockShifts),
    missionShifts: jest.fn().mockResolvedValue(mockShifts),
    update: jest.fn().mockResolvedValue(mockShift),
    create: jest.fn().mockResolvedValue(mockShift),
    allocateShifts: jest.fn().mockResolvedValue(undefined),
    updateShiftsManually: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [
        {
          provide: ShiftsService,
          useValue: mockShiftsService,
        },
      ],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
    service = module.get<ShiftsService>(ShiftsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('sparta', () => {
    it('should return shifts for sparta view', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const unitId = 'unit-1';

      const result = await controller.sparta(unitId, start, end);

      expect(result).toEqual(mockShifts);
      expect(service.spartaView).toHaveBeenCalledWith(unitId, start, end);
    });
  });

  describe('missionShifts', () => {
    it('should return shifts for a specific mission', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const missionId = 'mission-1';

      const result = await controller.missionShifts(missionId, start, end);

      expect(result).toEqual(mockShifts);
      expect(service.missionShifts).toHaveBeenCalledWith(missionId, start, end);
    });
  });

  describe('updateById', () => {
    it('should update a shift by id', async () => {
      const id = 'shift-1';
      const updateShiftDto: UpdateShiftDto = { comment: 'Updated shift' };

      const result = await controller.updateById(
        mockRequest as any,
        id,
        updateShiftDto,
      );

      expect(result).toEqual(mockShift);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user,
        id,
        updateShiftDto,
      );
    });
  });

  describe('create', () => {
    it('should create a new shift', async () => {
      const createShiftDto: CreateShiftDto = {
        missionId: 'mission-1',
        date: new Date(),
        comment: 'New shift',
        shiftType: 'FULL_DAY' as any,
      };

      const result = await controller.create(
        mockRequest as any,
        createShiftDto,
      );

      expect(result).toEqual(mockShift);
      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user,
        createShiftDto,
      );
    });
  });

  describe('allocate', () => {
    it('should allocate shifts to users', async () => {
      const missionId = 'mission-1';
      const body = {
        userIds: ['user-1', 'user-2'],
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
        shiftsType: 'FULL_DAY' as any,
        usersPerShift: 2,
      };

      await controller.allocate(mockRequest as any, missionId, body);

      expect(service.allocateShifts).toHaveBeenCalledWith(
        mockRequest.user,
        missionId,
        body.userIds,
        { start: body.start, end: body.end },
        body.shiftsType,
        body.usersPerShift,
      );
    });
  });

  describe('updateShifts', () => {
    it('should update shifts manually', async () => {
      const body = {
        shifts: [mockShift],
        shiftsIdsToDelete: ['shift-2'],
      };

      await controller.updateShifts(mockRequest as any, body);

      expect(service.updateShiftsManually).toHaveBeenCalledWith(
        mockRequest.user,
        body.shifts,
        body.shiftsIdsToDelete,
      );
    });
  });

  describe('remove', () => {
    it('should remove a shift', async () => {
      const id = 'shift-1';

      await controller.remove(mockRequest as any, id);

      expect(service.remove).toHaveBeenCalledWith(mockRequest.user, id);
    });
  });
});
