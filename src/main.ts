import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  const configService = app.get(ConfigService);
  const COOKIE_SECRET = configService.get<string>('COOKIE_SECRET');
  const PORT = configService.get<string>('PORT') || 8386;
  const HOST = configService.get<string>('HOST') || '0.0.0.0';
  const FRONTEND_URL =
    configService.get<string>('NEXT_PUBLIC_URL') ||
    'https://mogi-three.vercel.app';
  app.enableCors({
    origin: FRONTEND_URL,
    credentials: true,
  });
  app.use(cookieParser(COOKIE_SECRET));
  await app.listen(PORT, HOST);
  console.log(`Server running at http://${HOST}:${PORT}`);
}

bootstrap();
