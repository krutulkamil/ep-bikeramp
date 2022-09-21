import { TripEntity } from '../trip/trip.entity';

export type TripType = Omit<TripEntity, "updateTimestamp">;