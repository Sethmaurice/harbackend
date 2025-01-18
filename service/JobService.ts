import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'Entities/Job/Job';
import { User } from 'Entities/User/User';

@Injectable()
export class JobService {
  getApplicationsOverTime() {
      throw new Error('Method not implemented.');
  }
  getJobsByCategory() {
      throw new Error('Method not implemented.');
  }
  findAll() {
      throw new Error('Method not implemented.');
  }
  delete(id: number) {
      throw new Error('Method not implemented.');
  }
  update(id: number, job: Job) {
      throw new Error('Method not implemented.');
  }
  create(job: Job, user: User) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async getAllJobs(filters?: any): Promise<Job[]> {
    const queryBuilder = this.jobRepository.createQueryBuilder('job');

    if (filters?.title) {
      queryBuilder.andWhere('job.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters?.category) {
      queryBuilder.andWhere('job.category LIKE :category', { category: `%${filters.category}%` });
    }
    if (filters?.location) {
      queryBuilder.andWhere('job.location LIKE :location', { location: `%${filters.location}%` });
    }

    return await queryBuilder.getMany();
  }

  async addJob(title: string, category: string, location: string, description: string): Promise<Job> {
    const newJob = this.jobRepository.create({
      title,
      category,
      location,
      description,
    });
    return this.jobRepository.save(newJob);
  }

        // Count total applications
        async countTotalJobs(): Promise<number> {
          return this.jobRepository.count(); // Counts all applications
        }
}
