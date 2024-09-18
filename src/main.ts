import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverless from 'serverless-http';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';

let server: any; // For serverless use

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      cors: true,
    },
  );

  app.use(cookieParser());

  // Uncomment if you want specific CORS settings
  // app.enableCors({
  //   origin: process.env.NEXT_PUBLIC_URL,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

  await app.init(); // Initialize NestJS app without listening on a port
  return serverless(expressApp); // Return serverless handler for Vercel
}

if (!server) {
  server = bootstrap();
}

export default server;
