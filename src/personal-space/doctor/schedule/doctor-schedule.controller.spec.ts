import { INestApplication } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DoctorScheduleController } from './doctor-schedule.controller';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('DoctorScheduleController', () => {
  let app: INestApplication;
  let doctorScheduleService: DoctorScheduleService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DoctorScheduleController],
      providers: [
        {
          provide: DoctorScheduleService,
          useValue: {
            get: jest.fn(),
          },
        },
        PrismaClient,
        JwtService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    doctorScheduleService = moduleFixture.get<DoctorScheduleService>(
      DoctorScheduleService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return doctor schedule for a given date range', async () => {
      const mockSchedule = [
        {
          id: 1,
          doctorId: 123,
          dayOfWeek: 1,
          start: new Date('2023-01-01T09:00:00.000Z'),
          end: new Date('2023-01-01T17:00:00.000Z'),
        },
      ];
      jest.spyOn(doctorScheduleService, 'get').mockResolvedValue(mockSchedule);

      const start = '2023-01-01';
      const end = '2023-01-07';

      const response = await request(app.getHttpServer())
        .get('/')q
        .query({ start, end })
        .set('Authorization', 'Bearer some-token')
        .expect(200);

      expect(response.body).toEqual(mockSchedule);
      expect(doctorScheduleService.get).toHaveBeenCalledWith(1, start, end);
    });

    it('should return the current week schedule if no date range is provided', async () => {
      const mockSchedule = [
        {
          id: 1,
          doctorId: 123,
          dayOfWeek: 1,
          start: new Date('2023-01-01T09:00:00.000Z'),
          end: new Date('2023-01-01T17:00:00.000Z'),
        },
      ];
      jest.spyOn(doctorScheduleService, 'get').mockResolvedValue(mockSchedule);

      const response = await request(app.getHttpServer())
        .get('/')
        .set('Authorization', 'Bearer some-token')
        .expect(200);

      expect(response.body).toEqual(mockSchedule);
      expect(doctorScheduleService.get).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
      );
    });

    it('should return 400 if the query parameters are invalid', async () => {
      await request(app.getHttpServer())
        .get('/')
        .query({ start: 'invalid-date', end: 'invalid-date' })
        .set('Authorization', 'Bearer some-token')
        .expect(400);
    });

    it('should return 401 if the user is not authorized', async () => {
      await request(app.getHttpServer()).get('/').expect(401);
    });
  });
});
