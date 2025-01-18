import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (React app running on localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    credentials: true, // If you're using cookies or JWT
  });

    // Use global validation pipes for input validation
    // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 4000); // Default to port 4000
}

bootstrap();