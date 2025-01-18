import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { JobService } from 'service/JobService';


@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly jobService: JobService) {}

  @Get('stats')
  async getJobStats() {
    const jobsByCategory = await this.jobService.getJobsByCategory();
    const applicationsOverTime = await this.jobService.getApplicationsOverTime();
    return { jobsByCategory, applicationsOverTime };
  }
}
