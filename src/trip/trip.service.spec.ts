import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripService } from './trip.service';
import { GoogleMapService } from '../utils/google-map/google-map.service';
import { ConfigService } from '@nestjs/config';
import { TripEntity } from './trip.entity';
import { TripType } from '../types/trip.type';

const tripObj1 = {
    start_address: 'Sarmacka 3A, Warszawa, Polska',
    destination_address: 'Plac Wolności 5, Katowice, Polska',
    price: 5.00,
    date: new Date(),
    distance: 303373
};

const tripObj2 = {
    start_address: 'Plac Wolności 3, Katowice, Polska',
    destination_address: 'Plac Wolności 5, Katowice, Polska',
    price: 5.00,
    date: new Date(),
    distance: 32
};

describe('TripService', () => {
    let service: TripService;
    let repo: Repository<TripEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TripService,
                ConfigService,
                GoogleMapService,
                {
                    provide: getRepositoryToken(TripEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue([tripObj1, tripObj2]),
                        create: jest.fn().mockResolvedValue(tripObj1),
                        save: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<TripService>(TripService);
        repo = module.get<Repository<TripEntity>>(getRepositoryToken(TripEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllTrips', () => {
        it('should return an array of trips', async () => {
            const trips = await service.getAllTrips();
            const repoSpy = jest.spyOn(repo, 'find');

            expect(trips).toEqual([tripObj1, tripObj2]);
            expect(trips).toHaveLength(2);
            expect(repoSpy).toHaveBeenCalled();
            expect(repoSpy).toBeCalledTimes(1);
        });

        it('should return proper values for objects', async () => {
            const trips = await service.getAllTrips();
            expect(trips).toEqual([tripObj1, tripObj2]);

            expect(trips[0]).toEqual(tripObj1);
            expect(trips[0].start_address).toEqual('Sarmacka 3A, Warszawa, Polska');
            expect(trips[0].start_address).not.toEqual('Plac Wolności 5, Katowice, Polska');
            expect(trips[1]).toEqual(tripObj2);
            expect(trips[1].start_address).toEqual('Plac Wolności 3, Katowice, Polska');
            expect(trips[1].start_address).not.toEqual('Plac Wolności 5, Katowice, Polska');
            expect(trips[0]).not.toEqual(tripObj2);
            expect(trips[1]).not.toEqual(tripObj1);
        });
    });

    describe('createTrip', () => {
        it('should create a new trip', async () => {
            const { start_address, destination_address, price, date, distance } = tripObj1;
            jest.spyOn(service, 'createTrip')
                .mockImplementation((dto: TripType): Promise<TripType> => Promise.resolve({ ...dto, distance }));

            await expect(service.createTrip({
                start_address,
                destination_address,
                date,
                price
            })).resolves.toEqual(tripObj1);
            await expect(service.createTrip).toHaveBeenCalled();
        });
    });
});
