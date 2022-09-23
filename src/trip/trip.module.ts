import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripEntity } from './trip.entity';

@Module({
    controllers: [TripController],
    providers: [TripService],
    imports: [TypeOrmModule.forFeature([TripEntity])]
})
export class TripModule {}
