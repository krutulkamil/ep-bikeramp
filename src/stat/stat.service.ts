import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DateService } from '../utils/date/date.service';
import { IMonthlyStats, IWeeklyStats } from '../types/stat.interface';
import { TripType } from '../types/trip.type';

@Injectable()
export class StatService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly dateService: DateService
    ) {}

    async getWeeklyStats(): Promise<IWeeklyStats> {
        const currentWeekQuery: string = this.dateService.getWeeklyQuery();
        const weeklyTrips: TripType[] = await this.dataSource.query(currentWeekQuery);

        const calculateTotalPrice = weeklyTrips
            // get all earnings by day of a current week
            .map((week) => +week.price)
            // reduce it to one number
            .reduce((acc, item) => acc + item, 0);

        const calculateTotalDistance = weeklyTrips
            .map((week) => week.distance)
            .reduce((acc, item) => acc + item, 0);

        const totalPriceFormatted = this.formatCurrency(calculateTotalPrice);
        const totalDistanceFormatted = this.formatDistance(calculateTotalDistance);

        return {
            total_distance: totalDistanceFormatted,
            total_price: totalPriceFormatted
        };
    };

    async getMonthlyStats(): Promise<IMonthlyStats[]> {
        const currentMonthQuery: string = this.dateService.getMonthlyQuery();
        const monthlyTrips: IMonthlyStats[] = await this.dataSource.query(currentMonthQuery);

        const monthlyTripsFormatted = monthlyTrips.map((trip) => ({
            day: this.dateService.formatDateString(trip.day),
            total_distance: this.formatDistance(trip.total_distance),
            avg_ride: this.formatDistance(trip.avg_ride),
            avg_price: this.formatCurrency(trip.avg_price)
        }));

        return monthlyTripsFormatted;
    };

    formatDistance(distance: string | number): string {
        if (typeof distance === 'string') {
            return `${(+distance / 1000).toFixed(2)}km`;
        }
        return `${(distance / 1000).toFixed(2)}km`;
    };

    formatCurrency(value: string | number, currency = 'PLN'): string {
        if (typeof value === 'string') {
            return `${(+value).toFixed(2)}${currency}`;
        }
        return `${(value).toFixed(2)}${currency}`;
    };
}
