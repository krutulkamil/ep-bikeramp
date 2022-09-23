import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripEntity } from './trip.entity';
import { GoogleMapsModule } from '../google-maps/google-maps.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TripEntity]),
        GoogleMapsModule
    ],
    controllers: [TripController],
    providers: [TripService]
})
export class TripModule {}
