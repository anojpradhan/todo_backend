import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guards';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(app.get(AuthGuard));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
