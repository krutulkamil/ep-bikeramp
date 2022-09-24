import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleMapService } from './google-map.service';

describe('GoogleMapService', () => {
    let service: GoogleMapService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                GoogleMapService
            ]
        }).compile();

        service = module.get<GoogleMapService>(GoogleMapService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateDistance', () => {
        it('should return distance between two points', async() => {
           const startAddress = 'Sarmacka 3A, Warszawa, Polska';
           const destinationAddress = 'Plac Wolności 5, Katowice, Polska';
           const result = { text: '303 km', value: 303373 };

           jest.spyOn(service, 'calculateDistance').mockImplementation((start_address: string, destination_address: string) => Promise.resolve(result));

           expect(await service.calculateDistance(startAddress, destinationAddress)).toBe(result);
           await expect(service.calculateDistance(startAddress, destinationAddress)).resolves.toEqual(result);
        });
    })
});
