import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { CreateScheduleDTO } from '../src/schedule/dto/CreateScheduleDTO';
import { TrimPipe } from '../src/pipes/TrimPipe';
import { AuthDto } from 'src/auth/dto/auth.dto';


const schedule: CreateScheduleDTO = {
  date: new Date(),
  roomId: new Types.ObjectId().toHexString()
}

const scheduleFake: CreateScheduleDTO = {
  date: new Date(),
  roomId: ''
}

const scheduleFake1 = {
  date: new Date(),
}

const scheduleFake2 = {
  date: '123123',
  roomId: [123]
}

const authLogin: AuthDto = {
  "login": "hello@alexstrigo.ru",
  "password": "12345678"
}


let scheduleId: string
let scheduleIdFake = new Types.ObjectId().toHexString()
describe('SheduleController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new TrimPipe(),
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    const data = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLogin)

    token = data.body.access_token
  });

  afterEach(async () => {
    await app.close();
  });

  it('/schedule (POST) fail unauth', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .send(schedule)
      .expect(401)
  });

  it('/schedule (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(scheduleFake)
      .expect(400)
  });

  it('/schedule (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .set('Authorization', `Bearer ${token}`)
      .send(scheduleFake1)
      .expect(400)
  });

  it('/schedule (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send(scheduleFake2)
      .expect(400)
  });

  it('/schedule (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/schedule')
      .set('Authorization', `Bearer ${token}`)
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

  it('/schedule (PUT) fail unauth', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .send({ ...schedule, _id: scheduleId })
      .expect(401)
  });

  it('/schedule (PUT) success', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...schedule, _id: scheduleId })
      .expect(200)
  });

  it('/schedule (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...scheduleFake, _id: scheduleId })
      .expect(400)
  });

  it('/schedule (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...scheduleFake1, _id: scheduleId })
      .expect(400)
  });

  it('/schedule (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...scheduleFake2, _id: scheduleId })
      .expect(400)
  });

  schedule.date.setMonth(Math.abs(schedule.date.getMonth() - 1))
  it('/schedule (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...schedule, _id: scheduleIdFake })
      .expect(404)
  });

  it('/schedule/:id (DELETE) fail unauth', async () => {
    return request(app.getHttpServer())
      .delete(`/schedule/${scheduleId}`)
      .expect(401)
  });

  it('/schedule/:id (DELETE) success', async () => {
    return request(app.getHttpServer())
      .delete(`/schedule/${scheduleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });

  it('/schedule/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete(`/schedule/${scheduleIdFake}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  });

});
