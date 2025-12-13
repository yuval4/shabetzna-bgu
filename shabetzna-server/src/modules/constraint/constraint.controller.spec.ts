import { Test, TestingModule } from '@nestjs/testing';
import { ConstraintController } from './constraint.controller';
import { ConstraintService } from './constraint.service';

describe('ConstraintController', () => {
  let controller: ConstraintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstraintController],
      providers: [ConstraintService],
    }).compile();

    controller = module.get<ConstraintController>(ConstraintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
