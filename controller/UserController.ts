import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApplicationService } from 'service/ApplicationService';
import { Application } from 'Entities/Application/Application';
import { JwtAuthGuard } from 'guards/JwtAuthGuard'; // Guard for JWT Authentication
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'Entities/User/User';

@Controller('jobs')
@UseGuards(JwtAuthGuard) // Protect the entire controller with the JwtAuthGuard
export class UserJobController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobId/apply')
  async applyJob(@Param('jobId') jobId: number, @Auth() user: User) {
    return this.applicationService.applyForJob(user.id, jobId);
  }

  @Get(':jobId/status')
  async getApplicationStatus(@Param('jobId') jobId: number, @Auth() user: User) {
    return this.applicationService.getStatus(user.id, jobId);
  }
}
