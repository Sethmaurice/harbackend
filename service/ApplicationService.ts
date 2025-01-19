import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'Entities/Application/Application';
import { Job } from 'Entities/Job/Job';
import { User } from 'Entities/User/User';
import { EmailService } from './EmailService';

@Injectable()
export class ApplicationService {
  count(): number | PromiseLike<number> {
    throw new Error('Method not implemented.');
  }
  getStatus(id: any, jobId: number) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async applyForJob(userId: number, jobId: number): Promise<Application> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
  
    const existingApplication = await this.applicationRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });
    if (existingApplication) {
      throw new BadRequestException(`You have already applied for this job`);
    }
  
    const application = this.applicationRepository.create({
      user,
      job,
      status: 'Pending',
    });
  
    // return await this.applicationRepository.save(application);

    // Save application
    const savedApplication = await this.applicationRepository.save(application);

    // Send email notification
    const subject = `Application Status Update`;
    const message = `Hello ${user.email}, your application status has been updated to: ${savedApplication.status}.`;

    await this.emailService.sendEmail(user.email, subject, message);

    return savedApplication;
  }

  async getApplicationsByUser(userId: number): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { user: { id: userId } },
      relations: ['job'],
    });
  }

  async getApplicationStatus(applicationId: number): Promise<Application> {
    return this.applicationRepository.findOne({ where: { id: applicationId }, relations: ['job', 'user'] });
  }

      // Count total applications
      async countTotalApplications(): Promise<number> {
        return this.applicationRepository.count(); // Counts all applications
      }

  //TRY ME

  // Get applications with pagination, sorting, and filtering
  async getApplicants(
    page: number = 1,
    limit: number = 10,
    status?: string,
    dateRangeStart?: string,
    dateRangeEnd?: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    const queryBuilder = this.applicationRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.job', 'job')
      .skip((page - 1) * limit)
      .take(limit);

    // Apply filtering by status
    if (status) {
      queryBuilder.andWhere('application.status = :status', { status });
    }

    // Apply date range filtering
    if (dateRangeStart && dateRangeEnd) {
      queryBuilder.andWhere('application.dateApplied BETWEEN :start AND :end', { start: dateRangeStart, end: dateRangeEnd });
    }

    // Sorting
    if (sortBy) {
      queryBuilder.orderBy(`application.${sortBy}`, sortOrder);
    }

    const applications = await queryBuilder.getMany();
    const totalApplications = await queryBuilder.getCount();

    return {
      applications,
      totalApplications,
      totalPages: Math.ceil(totalApplications / limit),
    };
  }

  // Update application status (for admin)
  async updateApplicationStatus(applicationId: number, status: string) {
    const application = await this.applicationRepository.findOne({ where: { id: applicationId } });
    if (!application) throw new Error('Application not found');
    application.status = status;
    return this.applicationRepository.save(application);
  }

}


// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Application } from 'Entities/Application/Application';
// import { Job } from 'Entities/Job/Job';
// import { User } from 'Entities/User/User';

// @Injectable()
// export class ApplicationService {
//   constructor(
//     @InjectRepository(Application)
//     private applicationRepository: Repository<Application>,
//     @InjectRepository(Job)
//     private jobRepository: Repository<Job>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   // Method to get applications with pagination, sorting, and filtering
//   async getApplications(
//     page: number = 1,
//     limit: number = 10,
//     status?: string,
//     dateRangeStart?: string,
//     dateRangeEnd?: string,
//     sortBy: string = 'dateApplied',
//     sortOrder: 'ASC' | 'DESC' = 'ASC',
//   ) {
//     const queryBuilder = this.applicationRepository.createQueryBuilder('application')
//       .leftJoinAndSelect('application.user', 'user')
//       .leftJoinAndSelect('application.job', 'job')
//       .skip((page - 1) * limit)
//       .take(limit);

//     // Apply filtering by status
//     if (status) {
//       queryBuilder.andWhere('application.status = :status', { status });
//     }

//     // Apply date range filtering
//     if (dateRangeStart && dateRangeEnd) {
//       queryBuilder.andWhere('application.dateApplied BETWEEN :start AND :end', { start: dateRangeStart, end: dateRangeEnd });
//     }

//     // Sorting
//     if (sortBy) {
//       queryBuilder.orderBy(`application.${sortBy}`, sortOrder);
//     }

//     const applications = await queryBuilder.getMany();
//     const totalApplications = await queryBuilder.getCount();

//     return {
//       applications,
//       totalApplications,
//       totalPages: Math.ceil(totalApplications / limit),
//     };
//   }

//   // Method to update application status (for admin)
//   async updateApplicationStatus(applicationId: number, status: string) {
//     const application = await this.applicationRepository.findOne({ where: { id: applicationId } });
//     if (!application) throw new NotFoundException('Application not found');
//     application.status = status;
//     return this.applicationRepository.save(application);
//   }

//   async applyForJob(userId: number, jobId: number): Promise<Application> {
//         const user = await this.userRepository.findOne({ where: { id: userId } });
//         if (!user) {
//           throw new NotFoundException(`User with ID ${userId} not found`);
//         }
      
//         const job = await this.jobRepository.findOne({ where: { id: jobId } });
//         if (!job) {
//           throw new NotFoundException(`Job with ID ${jobId} not found`);
//         }
      
//         const existingApplication = await this.applicationRepository.findOne({
//           where: { user: { id: userId }, job: { id: jobId } },
//         });
//         if (existingApplication) {
//           throw new BadRequestException(`You have already applied for this job`);
//         }
      
//         const application = this.applicationRepository.create({
//           user,
//           job,
//           status: 'Pending',
//         });
      
//         return await this.applicationRepository.save(application);
//       }
    
//       async getApplicationsByUser(userId: number): Promise<Application[]> {
//         return await this.applicationRepository.find({
//           where: { user: { id: userId } },
//           relations: ['job'],
//         });
//       }
    
//       async getApplicationStatus(applicationId: number, jobId: number): Promise<Application> {
//         return this.applicationRepository.findOne({ where: { id: applicationId }, relations: ['job', 'user'] });
//       }
// }
