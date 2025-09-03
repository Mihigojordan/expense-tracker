import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  
  // Enhanced CORS configuration
app.enableCors({
  origin: [
    process.env.CORS_ORIGIN,

  ].filter(Boolean),
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  credentials: true,
  preflightContinue: false,
  
});

  // Extended JSON parsing
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

 

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();