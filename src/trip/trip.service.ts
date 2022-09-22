import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, Distance, TravelMode } from '@googlemaps/google-maps-services-js';
import { TripEntity } from './trip.entity';
import { TripDto } from './trip.dto';
import { TripType } from '../types/trip.type';

@Injectable()
export class TripService extends Client {
    constructor(
        @InjectRepository(TripEntity) private readonly tripRepository: Repository<TripEntity>,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    private readonly mapsKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    async getAllTrips(): Promise<TripType[]> {
        return await this.tripRepository.find({
            order: {
                updatedAt: "DESC"
            }
        });
    };

    async createTrip(dto: TripDto): Promise<TripType> {
        const { value } = await this.calculateDistance(
            dto.startAddress, dto.destinationAddress
        );

        const newTrip = this.tripRepository.create({...dto, distance: value});
        await this.tripRepository.save(newTrip);

        return newTrip;
    };

    async calculateDistance(
        startAddress: string,
        destinationAddress: string
    ): Promise<Distance> {
        const { data } = await this.distancematrix({
            params: {
                origins: [startAddress],
                destinations: [destinationAddress],
                mode: TravelMode.bicycling,
                key: this.mapsKey
            }
        });

        const distance = data.rows[0].elements[0].distance;
        return distance;
    };
}
