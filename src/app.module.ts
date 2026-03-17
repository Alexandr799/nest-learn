import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import mongoConfig from './config/mongo.config';
import { TelegramModule } from './telegram/telegram.module';
import telegramConfig from './config/telegram.config';

@Module({
  imports: [
    ScheduleModule, 
    RoomModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongoConfig,
    }),
        TelegramModule.forRootAsync({
      inject: [ConfigService],
      useFactory: telegramConfig
    }),
    UserModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
