import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

enum QUERY {
    WEEK_START = `(DATE_TRUNC('WEEK', CURRENT_DATE::TIMESTAMP)::DATE)`,
    WEEK_END = `(DATE_TRUNC('WEEK', CURRENT_DATE::TIMESTAMP) + '6 DAYS'::INTERVAL)::DATE`,
    MONTH_START = `(DATE_TRUNC('MONTH', CURRENT_DATE::TIMESTAMP)::DATE)`,
    MONTH_END = `(DATE_TRUNC('MONTH', CURRENT_DATE::TIMESTAMP)::DATE + INTERVAL '1 MONTH - 1 DAY')::DATE`
}

@Injectable()
export class DateService {
    private readonly weekStartDate = QUERY.WEEK_START;
    private readonly weekEndDate = QUERY.WEEK_END;
    private readonly monthStartDate = QUERY.MONTH_START;
    private readonly monthEndDate = QUERY.MONTH_END;

    private getWeeklyQuery() {
        return `SELECT * FROM trip WHERE date BETWEEN ${this.weekStartDate} AND ${this.weekEndDate};`
    };

    private getMonthlyQuery() {
        return `SELECT * FROM trip WHERE date BETWEEN ${this.monthStartDate} AND ${this.monthEndDate};`
    };

    formatDateString(date: string): string {
        const stringIntoDate = new Date(date);
        return moment(stringIntoDate).format('MMMM, Do');
    };
}