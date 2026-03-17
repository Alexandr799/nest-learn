import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrimPipe } from './pipes/TrimPipe';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
