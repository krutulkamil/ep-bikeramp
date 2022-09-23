import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripType } from '../types/trip.type';
import { TripDto } from './trip.dto';
import { BackendValidationPipe } from '../shared/pipes/backendValidation.pipe';

@Controller('trips')
export class TripController {
    constructor(private readonly tripService: TripService) {}

    @Get()
    async getAllTrips(): Promise<TripType[]> {
        return await this.tripService.getAllTrips();
    };

    @Post()
    @UsePipes(new BackendValidationPipe())
    async createTrip(@Body() dto: TripDto): Promise<TripType> {
        return await this.tripService.createTrip(dto);
    }
}
