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

        const totalPriceFormatted = `${calculateTotalPrice}PLN`;
        const totalDistanceFormatted = `${(calculateTotalDistance / 1000).toFixed(2)}km`

        return {
            total_distance: totalDistanceFormatted,
            total_price: totalPriceFormatted
        }
    };

    // @ts-ignore
    async getMonthlyStats(): Promise<IMonthlyStats[]> {};
}
