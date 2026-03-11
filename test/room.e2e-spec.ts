import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRoomDTO } from '../src/room/dto/CreateRoomDTO';
import { Types } from 'mongoose';
import { TrimPipe } from '../src/pipes/TrimPipe';

const room: CreateRoomDTO = {
  seaViewExists: true,
  number: 1,
  type: 2
}
const roomFake: CreateRoomDTO = {
  seaViewExists: true,
  number: -1,
  type: -2
}
let roomId: string
let roomIdFake: string = new Types.ObjectId().toHexString()

describe('RoomController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new TrimPipe(),
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/room (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .send(room)
      .expect(201)
      .then(({ body }: request.Response) => {
        roomId = body._id
        expect(roomId).toBeDefined()
      });
  });

  it('/room (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .send(roomFake)
      .expect(400)
  });

  it('/room (GET) success', async () => {
    return request(app.getHttpServer())
      .get('/room')
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBeGreaterThanOrEqual(1)
      });
  });

  it('/room/:id (GET) success', async () => {
    return request(app.getHttpServer())
      .get(`/room/${roomId}`)
      .expect(200)
  });

  it('/room/:id (GET) fail', async () => {
    return request(app.getHttpServer())
      .get(`/room/${roomIdFake}`)
      .expect(404)
  });

  it('/room (PUT) success', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .send({ ...room, _id: roomId })
      .expect(200)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .send({ ...roomFake, _id: roomId })
      .expect(400)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .send({ ...room, _id: roomIdFake })
      .expect(404)
  });

  it('/room/:id (DELETE) success', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomId}`)
      .expect(200)
  });

  it('/room/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomIdFake}`)
      .expect(404)
  });

});
