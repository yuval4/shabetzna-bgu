import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConstraintService } from '../constraint/constraint.service';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';

describe('ShiftsService', () => {
  let service: ShiftsService;
  const mockShiftRepository = {};
  const mockConstraintService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: getRepositoryToken(Shift),
          useValue: mockShiftRepository,
        },
        {
          provide: ConstraintService,
          useValue: mockConstraintService,
        },
      ],
    }).compile();

    service = module.get<ShiftsService>(ShiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
