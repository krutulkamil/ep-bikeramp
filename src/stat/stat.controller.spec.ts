import { Test, TestingModule } from '@nestjs/testing';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { IMonthlyStats, IWeeklyStats } from '../types/stat.interface';

const weeklyStats: IWeeklyStats = {
    total_distance: '313.37km',
    total_price: '346.12PLN'
};

const monthlyStats: IMonthlyStats[] = [
    {
        day: 'September, 18th',
        total_distance: '910.15km',
        avg_ride: '227.54km',
        avg_price: '5.00PLN'
    },
    {
        day: 'September, 19th',
        total_distance: '0.03km',
        avg_ride: '0.03km',
        avg_price: '5.00PLN'
    }
];

describe('StatController', () => {
    let controller: StatController;
    let service: StatService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StatController],
            providers: [
                StatService,
                {
                    provide: StatService,
                    useValue: {
                        getWeeklyStats: jest.fn().mockResolvedValue(weeklyStats),
                        getMonthlyStats: jest.fn().mockResolvedValue(monthlyStats)
                    }
                }
            ]
        }).compile();

        controller = module.get<StatController>(StatController);
        service = module.get<StatService>(StatService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getWeeklyStats', () => {
        it('should return proper weekly stats', async () => {
            await expect(controller.getWeeklyStats()).resolves.toEqual(weeklyStats);
        });
    });

    describe('getMonthlyStats', () => {
        it('should return proper monthly stats', async () => {
            await expect(controller.getMonthlyStats()).resolves.toEqual(monthlyStats);
        });
    });
});
