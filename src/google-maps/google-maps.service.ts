import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Distance, TravelMode } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GoogleMapsService extends Client {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    private readonly mapsKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    async calculateDistance(
        start_address: string,
        destination_address: string
    ): Promise<Distance> {
        const { data } = await this.distancematrix({
            params: {
                origins: [start_address],
                destinations: [destination_address],
                mode: TravelMode.bicycling,
                key: this.mapsKey
            }
        });

        const distance = data.rows[0].elements[0].distance;

        const errorResponse = {
            errors: {
                "start_address or destination_address": "Is invalid! Check addresses one more time!"
            }
        }

        if (!distance) throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        return distance;
    };
}
