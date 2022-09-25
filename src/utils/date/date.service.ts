import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { QUERY } from '../../types/query.enum';

@Injectable()
export class DateService {
    private readonly weekStartDate = QUERY.WEEK_START;
    private readonly weekEndDate = QUERY.WEEK_END;
    private readonly monthStartDate = QUERY.MONTH_START;
    private readonly monthEndDate = QUERY.MONTH_END;

    getWeeklyQuery(): string {
        return `SELECT * FROM trip WHERE date BETWEEN ${this.weekStartDate} AND ${this.weekEndDate};`
    };

    getMonthlyQuery(): string {
        return `SELECT date as day, SUM(distance) AS total_distance, AVG(distance) as avg_ride, AVG(price) as avg_price FROM trip WHERE date BETWEEN ${this.monthStartDate} AND ${this.monthEndDate} GROUP BY date ORDER BY date ASC;`
    };

    formatDateString(date: string): string {
        const stringIntoDate = new Date(date);
        return moment(stringIntoDate).format('MMMM, Do');
    };
}