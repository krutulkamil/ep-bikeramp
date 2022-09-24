import { Test, TestingModule } from '@nestjs/testing';
import { DateService } from './date.service';

describe('DateService', () => {
    let service: DateService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DateService
            ]
        }).compile();

        service = module.get<DateService>(DateService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getWeeklyQuery', () => {
        it('should return proper weekly query', () => {
            expect(service
                .getWeeklyQuery())
                .toEqual(
                    `SELECT * FROM trip WHERE date BETWEEN (DATE_TRUNC('WEEK', CURRENT_DATE::TIMESTAMP)::DATE) AND (DATE_TRUNC('WEEK', CURRENT_DATE::TIMESTAMP) + '6 DAYS'::INTERVAL)::DATE;`
                );
        });
    });

    describe('getMonthlyQuery', () => {
        it('should return proper monthly query', () => {
            expect(service
                .getMonthlyQuery())
                .toEqual(
                    `SELECT date as day, SUM(distance) AS total_distance, AVG(distance) as avg_ride, AVG(price) as avg_price FROM trip WHERE date BETWEEN (DATE_TRUNC('MONTH', CURRENT_DATE::TIMESTAMP)::DATE) AND (DATE_TRUNC('MONTH', CURRENT_DATE::TIMESTAMP)::DATE + INTERVAL '1 MONTH - 1 DAY')::DATE GROUP BY date;`
                );
        });
    });

    describe('formatDateString', () => {
        it('should correctly format date', () => {
            const dateString = '2022-09-25';
            const result = service.formatDateString(dateString);

            expect(result).not.toEqual(dateString);
            expect(result).not.toBeFalsy();

            expect(result).toBeDefined();
            expect(result).toEqual('September, 25th');
        });
    });
});
