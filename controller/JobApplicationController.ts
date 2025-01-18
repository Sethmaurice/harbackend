// /controller/JobApplicationController.ts
import { Controller, Get, Query, Put, Param, Body } from '@nestjs/common';
import { JobApplicationService } from 'service/JobApplicationService';
// import { JobApplicationService } froservice/JobApplicationServiceion';

@Controller('applicants')
export class JobApplicationController {
  constructor(private readonly applicationService: JobApplicationService) {}

  // Get applications with pagination, sorting, and filtering
  @Get()
  async getApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: string,
    @Query('dateRangeStart') dateRangeStart: string,
    @Query('dateRangeEnd') dateRangeEnd: string,
    @Query('sortBy') sortBy: string = 'dateApplied',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.applicationService.getApplications(
      page,
      limit,
      status,
      dateRangeStart,
      dateRangeEnd,
      sortBy,
      sortOrder,
    );
  }

  // Update application status
  @Put(':id/status')
  async updateApplicationStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.applicationService.updateApplicationStatus(id, status);
  }

  // JobApplicationController.ts
// @Put(':id/status')
// async updateApplicationStatus(
//   @Param('id') id: number,
//   @Body() body: { status: string },
// ) {
//   const { status } = body;
//   return this.applicationService.updateApplicationStatus(id, status);
// }

}
