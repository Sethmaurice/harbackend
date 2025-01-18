// /service/JobApplicationService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from 'Entities/Application/Application';
import { User } from 'Entities/User/User';
import { Job } from 'Entities/Job/Job';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  // Get applications with pagination, sorting, and filtering
  async getApplications(
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

  // async updateApplicationStatus(applicationId: number, status: string) {
  //   console.log('Application ID:', applicationId);
  //   console.log('New Status:', status);
    
  //   const application = await this.applicationRepository.findOne({ where: { id: applicationId } });
  //   if (!application) throw new Error('Application not found');
    
  //   application.status = status;
  //   return this.applicationRepository.save(application);
  // }
  
}
