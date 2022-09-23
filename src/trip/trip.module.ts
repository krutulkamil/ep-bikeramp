import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripEntity } from './trip.entity';
import { GoogleMapModule } from '../google-map/google-map.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TripEntity]),
        GoogleMapModule
    ],
    controllers: [TripController],
    providers: [TripService]
})
export class TripModule {}
