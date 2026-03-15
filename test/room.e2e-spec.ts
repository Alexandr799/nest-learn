import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRoomDTO } from '../src/room/dto/CreateRoomDTO';
import { Types } from 'mongoose';
import { TrimPipe } from '../src/pipes/TrimPipe';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { exit } from 'process';

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

const roomFake1 = {
  seaViewExists: true,
}

const roomFake2 = {
  seaViewExists: true,
  number: '-1s',
  type: '-2qwe'
}
let roomId: string
let roomIdFake: string = new Types.ObjectId().toHexString()
const authLogin: AuthDto = {
  "login": "hello@alexstrigo.ru",
  "password": "12345678"
}

const authLoginUser: AuthDto = {
  "login": "user@alexstrigo.ru",
  "password": "1234567890",
}

describe('RoomController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let tokenUser: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await  moduleFixture.createNestApplication();
    await app.useGlobalPipes(
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

    const datafail = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLoginUser)
    tokenUser = datafail.body.access_token
  });

  afterEach(async () => {
    await app.close();
  });

  it('/room (POST) fail unauth', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .send(room)
      .expect(401)
  });

  it('/room (POST) fail forbidden', async () => {
      return request(app.getHttpServer())
        .post('/room')
        .set('Authorization', `Bearer ${tokenUser}`)
        .send(room)
        .expect(403)
  });

  it('/room (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(roomFake)
      .expect(400)
  });

  it('/room (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .set('Authorization', `Bearer ${token}`)
      .send(roomFake1)
      .expect(400)
  });

  it('/room (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/room')
      .set('Authorization', `Bearer ${token}`)
      .send(roomFake2)
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

  it('/room (PUT) fail unauth', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .send(room)
      .expect(401)
  });

  it('/room (PUT) fail forbidden', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(room)
      .expect(403)
  });

  it('/room (PUT) success', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...room, _id: roomId })
      .expect(200)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...roomFake, _id: roomId })
      .expect(400)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...roomFake1, _id: roomId })
      .expect(400)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
       .set('Authorization', `Bearer ${token}`)
      .send({ ...roomFake2, _id: roomId })
      .expect(400)
  });

  it('/room (PUT) fail', async () => {
    return request(app.getHttpServer())
      .put('/room')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...room, _id: roomIdFake })
      .expect(404)
  });

  it('/room/:id (DELETE) fail unauth', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomId}`)
      .send(room)
      .expect(401)
  });

  it('/room/:id (DELETE) fail forbidden', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomId}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(room)
      .expect(403)
  });

  it('/room/:id (DELETE) success', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });

  it('/room/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete(`/room/${roomIdFake}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  });

});
