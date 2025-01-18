import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JobService } from 'service/JobService';
import { Job } from 'Entities/Job/Job';
import { JwtAuthGuard } from 'guards/JwtAuthGuard'; // Guard for JWT Authentication
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'Entities/User/User';
import { from } from 'rxjs';

@Controller('admin/jobs')
@UseGuards(JwtAuthGuard) // Protect the entire controller with the JwtAuthGuard
export class AdminJobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() job: Job, @Auth() user: User) {
    if (user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.jobService.create(job, user);
  }

  @Put(':id')
  async updateJob(@Param('id') id: number, @Body() job: Job, @Auth() user: User) {
    if (user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.jobService.update(id, job);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: number, @Auth() user: User) {
    if (user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.jobService.delete(id);
  }

  @Get()
  async getAllJobs() {
    return this.jobService.findAll();
  }
}
