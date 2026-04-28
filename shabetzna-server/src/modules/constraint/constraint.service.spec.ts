import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConstraintService } from './constraint.service';
import { Constraint } from './entities/constraint.entity';

describe('ConstraintService', () => {
  let service: ConstraintService;
  const mockConstraintRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConstraintService,
        {
          provide: getRepositoryToken(Constraint),
          useValue: mockConstraintRepository,
        },
      ],
    }).compile();

    service = module.get<ConstraintService>(ConstraintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
