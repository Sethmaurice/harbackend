import { Controller,Get, Query, Put, Post, Param, Body } from '@nestjs/common';
import { ApplicationService } from 'service/ApplicationService';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply/:userId/:jobId')
  async apply(@Param('userId') userId: number, @Param('jobId') jobId: number) {
    return this.applicationService.applyForJob(userId, jobId);
  }

  @Get('user/:userId')
  async getApplications(@Param('userId') userId: number) {
    return this.applicationService.getApplicationsByUser(userId);
  }

  @Get('status/:id')
  async viewApplicationStatus(@Param('id') id: number) {
    return this.applicationService.getApplicationStatus(id);
  }
  
 // New endpoint for total applications
 @Get('total')
 async getTotalApplications() {
   const totalApplications = await this.applicationService.countTotalApplications();
   return { totalApplications };
 }

  // TRY ME

  // Get applications with pagination, sorting, and filtering
    @Get()
    async getApplicants(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('status') status: string,
      @Query('dateRangeStart') dateRangeStart: string,
      @Query('dateRangeEnd') dateRangeEnd: string,
      @Query('sortBy') sortBy: string = 'dateApplied',
      @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    ) {
      return this.applicationService.getApplicants(
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
}


// import { Controller, Post, Param, Get, Query, Body, Put } from '@nestjs/common';
// import { ApplicationService } from 'service/ApplicationService';

// @Controller('admin/applications')
// export class ApplicationController {
//   constructor(private readonly applicationService: ApplicationService) {}

//   // Admin: Get applications with pagination, sorting, and filtering
//   @Get()
//   async getApplications(
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 10,
//     @Query('status') status: string,
//     @Query('dateRangeStart') dateRangeStart: string,
//     @Query('dateRangeEnd') dateRangeEnd: string,
//     @Query('sortBy') sortBy: string = 'dateApplied',
//     @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
//   ) {
//     return this.applicationService.getApplications(
//       page,
//       limit,
//       status,
//       dateRangeStart,
//       dateRangeEnd,
//       sortBy,
//       sortOrder,
//     );
//   }

//   // Admin: Update application status
//   @Put(':id/status')
//   async updateApplicationStatus(
//     @Param('id') id: number,
//     @Body('status') status: string,
//   ) {
//     return this.applicationService.updateApplicationStatus(id, status);
//   }
// }
