import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BackendValidationPipe } from '../src/shared/pipes/backendValidation.pipe';

// IN ORDER TO TEST WEEKLY/MONTHLY
// GIVE TRIP1 & TRIP2 SAME DATE (START OF CURRENT WEEK)
// GIVE TRIP3 DATE 2 DAYS LATER FOR EXAMPLE.

const trip1 = {
    start_address: 'Plac Wolności 5, Katowice, Polska',
    destination_address: 'Saska 3A, Warszawa, Polska',
    price: 12.34,
    date: '2022-09-26'
};

const trip2 = {
    start_address: 'Mariacka 25, Katowice, Polska',
    destination_address: 'ul. Wiejska 4, Warszawa, Polska',
    price: 70.00,
    date: '2022-09-26'
};

const trip3 = {
    start_address: 'Mariacka 25, Katowice, Polska',
    destination_address: 'Plac Wolności 5, Katowice, Polska',
    price: 44.66,
    date: '2022-09-28'
};

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: getDataSourceToken({ type: 'postgres' }),
                    useValue: {}
                }
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new BackendValidationPipe());
        app.setGlobalPrefix('api');

        dataSource = moduleFixture.get<DataSource>(DataSource);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('AppModule', () => {
        it('GET default Hello World!', () => {
            return request(app.getHttpServer())
                .get('/api')
                .expect(200)
                .expect('Hello World!');
        });
    });

    describe('App E2E flow', () => {
        beforeEach(async () => {
            // delete all trip records for E2E testing
            await dataSource.query('DELETE FROM trip;');
        });

        it('deletes trip records', async () => {
            const allTrips = await request(app.getHttpServer())
                .get('/api/trips')
                .expect(200);

            expect(allTrips.body).toEqual([]);

            const weeklyStats = await request(app.getHttpServer())
                .get('/api/stats/weekly')
                .expect(200);

            expect(weeklyStats.body).toEqual({
                total_distance: '0.00km',
                total_price: '0.00PLN'
            });

            const monthlyStats = await request(app.getHttpServer())
                .get('/api/stats/monthly')
                .expect(200);

            expect(monthlyStats.body).toEqual([]);
        });

        it('post new trips, get all trips, get weekly/monthly stats', async () => {
            const trip1Data = await request(app.getHttpServer())
                .post('/api/trips')
                .send(trip1)
                .expect(201);

            expect(trip1Data.body).toEqual({
                ...trip1,
                id: expect.any(Number),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                distance: 308408
            });

            const trip2Data = await request(app.getHttpServer())
                .post('/api/trips')
                .send(trip2)
                .expect(201);

            expect(trip2Data.body).toEqual({
                ...trip2,
                id: expect.any(Number),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                distance: 306319
            });

            const trip3Data = await request(app.getHttpServer())
                .post('/api/trips')
                .send(trip3)
                .expect(201);

            expect(trip3Data.body).toEqual({
                ...trip3,
                id: expect.any(Number),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                distance: 1266
            });

            // backendValidation.pipe test
            const trip4 = {
                start_address: '',
                destination_address: '',
                price: '',
                date: ''
            };

            // 422 - Unprocessable Entity
            await request(app.getHttpServer())
                .post('/api/trips')
                .send(trip4)
                .expect(422);

            // Check if we have all trips
            const allTrips = await request(app.getHttpServer())
                .get('/api/trips')
                .expect(200);

            expect(allTrips.body).toBeTruthy();
            expect(allTrips.body).toHaveLength(3);

            // Get weekly
            const weeklyStats = await request(app.getHttpServer())
                .get('/api/stats/weekly')
                .expect(200);

            expect(weeklyStats.body).toEqual({
                total_distance: '615.99km',
                total_price: '127.00PLN'
            });

            // Get monthly
            const monthlyStats = await request(app.getHttpServer())
                .get('/api/stats/monthly')
                .expect(200);

            expect(monthlyStats.body).toHaveLength(2);
            expect(monthlyStats.body).toEqual([
                {
                    day: expect.any(String),
                    total_distance: expect.any(String),
                    avg_ride: expect.any(String),
                    avg_price: expect.any(String)
                },
                {
                    day: expect.any(String),
                    total_distance: expect.any(String),
                    avg_ride: expect.any(String),
                    avg_price: expect.any(String)
                }
            ]);
        });
    });
});
