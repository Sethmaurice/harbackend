import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema'; // Import the validation schema
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from 'Entities/User/User';
import { Job } from 'Entities/Job/Job';
import { Application } from 'Entities/Application/Application';
import { AuthModule } from './auth/auth.module'; // Add this import
import { JobController } from 'controller/JobController';
import { JobService } from 'service/JobService';
import { ApplicationController } from 'controller/ApplicationController';
import { ApplicationService } from 'service/ApplicationService';

@Module({
  imports: [
    // Load environment variables globally with validation
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule globally available
      validationSchema: configValidationSchema, // Add validation schema
    }),
    // Configure TypeORM with environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Ensure the environment variable is correctly set
      synchronize: true, // Use only in development
      autoLoadEntities: true, // Automatically load entities
      ssl: {
        rejectUnauthorized: false, // For Render-hosted PostgreSQL databases
      },
    }),
    TypeOrmModule.forFeature([User, Job, Application]), // Add entities to TypeORM
    AuthModule, // Add AuthModule here
  ],
  controllers: [AppController, JobController, ApplicationController], // Register JobController
  providers: [AppService, JobService, ApplicationService], // Register JobService
})
export class AppModule {}
