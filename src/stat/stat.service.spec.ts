import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { StatService } from './stat.service';
import { DateService } from '../utils/date/date.service';
import { IMonthlyStats, IWeeklyStats } from '../types/stat.interface';
import { DataSource } from 'typeorm';

describe('StatService', () => {
    let service: StatService;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatService,
                DateService,
                {
                    provide: getDataSourceToken({ type: 'postgres' }),
                    useValue: {}
                }
            ]
        }).compile();

        service = module.get<StatService>(StatService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getWeeklyStats', () => {
        it('should return proper weekly stats', async () => {
            const weeklyStats: IWeeklyStats = {
                total_distance: '313.37km',
                total_price: '346.12PLN'
            };

            jest
                .spyOn(service, 'getWeeklyStats')
                .mockImplementation(() => Promise.resolve(weeklyStats));

            const result = await service.getWeeklyStats();
            expect(result).toEqual(weeklyStats)
        });
    });

    describe('getMonthlyStats', () => {
        it('should return proper monthly stats', async () => {
            const monthlyStats: IMonthlyStats[] = [
                {
                    day: "September, 18th",
                    total_distance: "910.15km",
                    avg_ride: "227.54km",
                    avg_price: "5.00PLN"
                },
                {
                    day: "September, 19th",
                    total_distance: "0.03km",
                    avg_ride: "0.03km",
                    avg_price: "5.00PLN"
                }
            ];

            jest
                .spyOn(service, 'getMonthlyStats')
                .mockImplementation(() => Promise.resolve(monthlyStats));

            const result = await service.getMonthlyStats();
            expect(result).toEqual(monthlyStats)
        });
    });

    describe('formatDistance', () => {
        it('should format distance properly', () => {
            const distance = 12345;
            const result = service.formatDistance(distance);

            expect(result).not.toEqual(distance);
            expect(result).not.toEqual('12.345km');
            expect(result).not.toEqual('12345m');

            expect(result).toEqual('12.35km');
        });
    });

    describe('formatCurrency', () => {
        it('should format currency properly', () => {
            const numberValue = 234.567;
            const stringValue = '234.567';

            const defaultCurrencyResult = service.formatCurrency(numberValue);
            const defaultStringCurrencyResult = service.formatCurrency(stringValue);

            expect(defaultCurrencyResult).not.toEqual(numberValue);
            expect(defaultCurrencyResult).not.toEqual('234.57EUR')

            expect(defaultCurrencyResult).toEqual(defaultStringCurrencyResult);
            expect(defaultCurrencyResult).toEqual('234.57PLN');

            const euroCurrencyResult = service.formatCurrency(numberValue, 'EUR');
            const euroStringCurrencyResult = service.formatCurrency(stringValue, 'EUR');

            expect(euroCurrencyResult).toEqual(euroStringCurrencyResult);
            expect(euroCurrencyResult).toBe('234.57EUR');
        });
    });
});
