import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TripDto } from './trip.dto';
import { validate } from 'class-validator';

const todayDate = new Date();

describe('TripController', () => {
    let controller: TripController;
    let service: TripService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TripController],
            providers: [
                TripService,
                {
                    provide: TripService,
                    useValue: {
                        getAllTrips: jest.fn().mockResolvedValue([
                            {
                                start_address: 'Sarmacka 3A, Warszawa, Polska',
                                destination_address: 'Plac Wolności 5, Katowice, Polska',
                                price: 5.00,
                                date: todayDate,
                                distance: 303373
                            },
                            {
                                start_address: 'Plac Wolności 3, Katowice, Polska',
                                destination_address: 'Plac Wolności 5, Katowice, Polska',
                                price: 5.00,
                                date: todayDate,
                                distance: 32
                            }
                        ]),
                        createTrip: jest.fn().mockImplementation((dto: TripDto) => Promise.resolve({
                            id: 1, ...dto,
                            distance: 303373
                        }))
                    }
                }
            ]
        }).compile();

        controller = module.get<TripController>(TripController);
        service = module.get<TripService>(TripService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllTrips', () => {
        it('should get an array of trips', async () => {
            await expect(controller.getAllTrips()).resolves.toEqual([
                {
                    start_address: 'Sarmacka 3A, Warszawa, Polska',
                    destination_address: 'Plac Wolności 5, Katowice, Polska',
                    price: 5.00,
                    date: todayDate,
                    distance: 303373
                },
                {
                    start_address: 'Plac Wolności 3, Katowice, Polska',
                    destination_address: 'Plac Wolności 5, Katowice, Polska',
                    price: 5.00,
                    date: todayDate,
                    distance: 32
                }
            ]);
        });
    });

    describe('createTrip', () => {
        it('should validate DTO', async () => {
            const tripDto: TripDto = {
                start_address: '',
                destination_address: '',
                price: 20,
                date: new Date('2023-01-01')
            };

            const metadata: ArgumentMetadata = {
                type: 'body',
                metatype: TripDto,
                data: ''
            };

            const object = plainToInstance(metadata.metatype, tripDto);
            const validationResult = await validate(object);

            expect(validationResult).toBeTruthy();
            expect(validationResult).toHaveLength(3);

            expect(validationResult[0].constraints.isNotEmpty).toEqual('Start address is required!');
            expect(validationResult[1].constraints.isNotEmpty).toEqual('Destination address is required!');
            expect(validationResult[2].constraints.maxDate).toEqual('Only dates before 2023 supported!');
        });

        it('should create a new trip', async () => {
            const metadata: ArgumentMetadata = {
                type: 'body',
                metatype: TripDto,
                data: ''
            };

            const notValidDto: TripDto = {
                start_address: '',
                destination_address: '',
                price: 20,
                date: new Date('2023-01-01')
            };

            const validDto: TripDto = {
                start_address: 'ul. Mariacka 25, Katowice, Polska',
                destination_address: 'Plac Wolności 5, Katowice, Polska',
                price: 23.5,
                date: todayDate
            };

            const object1 = plainToInstance(metadata.metatype, notValidDto);
            const object2 = plainToInstance(metadata.metatype, validDto);
            const validationResult1 = await validate(object1);
            const validationResult2 = await validate(object2);

            expect(validationResult1).toHaveLength(3);
            expect(validationResult2).toHaveLength(0);

            await expect(controller.createTrip(notValidDto)).rejects;
            await expect(controller.createTrip(validDto)).resolves.toEqual({
                id: 1,
                start_address: 'ul. Mariacka 25, Katowice, Polska',
                destination_address: 'Plac Wolności 5, Katowice, Polska',
                price: 23.5,
                date: todayDate,
                distance: 303373
            });

            await expect(controller.createTrip(validDto)).resolves.not.toEqual(validDto);
            await expect(controller.createTrip(validDto)).resolves.toEqual({...validDto, id: 1, distance: 303373 });
        });
    });
});
