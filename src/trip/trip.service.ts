import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleMapService } from '../google-map/google-map.service';
import { TripEntity } from './trip.entity';
import { TripDto } from './trip.dto';
import { TripType } from '../types/trip.type';

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(TripEntity) private readonly tripRepository: Repository<TripEntity>,
        private readonly googleMapsService: GoogleMapService
    ) {};

    async getAllTrips(): Promise<TripType[]> {
        return await this.tripRepository.find({
            order: {
                updated_at: "DESC"
            }
        });
    };

    async createTrip(dto: TripDto): Promise<TripType> {
        const { value } = await this.googleMapsService.calculateDistance(
            dto.start_address, dto.destination_address
        );

        const newTrip = this.tripRepository.create({...dto, distance: value});
        await this.tripRepository.save(newTrip);

        return newTrip;
    };
}
