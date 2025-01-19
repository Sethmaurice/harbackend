import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (React app running on localhost:3000)
  app.enableCors({
    // origin: 'http://localhost:3000', // Frontend URL
    origin: 'https://harambeerw.vercel.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    credentials: true, // If you're using cookies or JWT
  });

  // await app.listen(process.env.PORT ?? 4000); // Default to port 4000 for localy
  await app.listen(process.env.PORT ?? 3000); // Default to port 4000 for render deployment

}

bootstrap();