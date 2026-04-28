import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from './entities/unit.entity';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

describe('UnitsController', () => {
    let controller: UnitsController;
    let service: UnitsService;

    const mockUnits: Unit[] = [
        {
            id: 'unit-1',
            name: 'Unit Alpha',
        },
        {
            id: 'unit-2',
            name: 'Unit Beta',
        },
    ];

    const mockUnitsService = {
        findAll: jest.fn().mockResolvedValue(mockUnits),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UnitsController],
            providers: [
                {
                    provide: UnitsService,
                    useValue: mockUnitsService,
                },
            ],
        }).compile();

        controller = module.get<UnitsController>(UnitsController);
        service = module.get<UnitsService>(UnitsService);
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
        it('should return an array of units', async () => {
            const result = await controller.findAll();

            expect(result).toEqual(mockUnits);
            expect(service.findAll).toHaveBeenCalledTimes(1);
            expect(service.findAll).toHaveBeenCalledWith();
        });

        it('should return an empty array when no units exist', async () => {
            mockUnitsService.findAll.mockResolvedValueOnce([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });

        it('should handle errors from service', async () => {
            const error = new Error('Database connection failed');
            mockUnitsService.findAll.mockRejectedValueOnce(error);

            await expect(controller.findAll()).rejects.toThrow('Database connection failed');
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });
});
