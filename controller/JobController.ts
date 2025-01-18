import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { JobService } from 'service/JobService';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('add')
  async addJob(@Body() jobData: { title: string, category: string, location: string, description: string }) {
    return this.jobService.addJob(jobData.title, jobData.category, jobData.location, jobData.description);
  }

  @Get(':id')
async getJobById(@Param('id') id: number) {
  return this.jobService.getJobById(id);
}

  @Get('total')
  async getTotalJobs() {
    console.log('Total jobs route hit');
    const totalJobs = await this.jobService.countTotalJobs();
    return { totalJobs };
  }
  

  @Get()
  async getJobs(@Query() filters: any) {
    return this.jobService.getAllJobs(filters);
  }

}
