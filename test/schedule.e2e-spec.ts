import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { CreateScheduleDTO } from 'src/schedule/dto/CreateScheduleDTO';


const schedule: CreateScheduleDTO = {
  date: new Date(),
  roomId: new Types.ObjectId().toHexString()
}
let scheduleId: string
let scheduleIdFake = new Types.ObjectId().toHexString()
describe('SheduleController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/schedule (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .send(schedule)
      .expect(201)
      .then(({ body }: request.Response) => {
        scheduleId = body._id
        expect(scheduleId).toBeDefined()
      });
  });

  it('/schedule (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .send(schedule)
      .expect(400)
  });

  it('/schedule (GET) success', async () => {
    return request(app.getHttpServer())
      .get('/schedule')
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBeGreaterThanOrEqual(1)
      });
  });

  it('/schedule/:id (GET) success', async () => {
    return request(app.getHttpServer())
      .get(`/schedule/${scheduleId}`)
      .expect(200)
  });

  it('/schedule/:id (GET) fail', async () => {
    return request(app.getHttpServer())
      .get(`/schedule/${scheduleIdFake}`)
      .expect(404)
  });

  it('/schedule (PUT) success', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .send({ ...schedule, _id: scheduleId })
      .expect(200)
  });

  schedule.date.setMonth(Math.abs(schedule.date.getMonth() - 1))
  it('/schedule (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .send({ ...schedule, _id: scheduleIdFake })
      .expect(404)
  });

  it('/schedule/:id (DELETE) success', async () => {
    return request(app.getHttpServer())
      .delete(`/schedule/${scheduleId}`)
      .expect(200)
  });

  it('/schedule/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete(`/schedule/${scheduleIdFake}`)
      .expect(404)
  });

});
