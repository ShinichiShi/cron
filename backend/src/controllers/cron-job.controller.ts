import { Post, Get, Delete, Body, Put, Param } from '@nestjs/common';
import { Controller, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CronJobService } from 'src/services/cron-job.service';
import { CreateCronJobDto } from 'src/dto/create-cron-job.dto';
@Controller('cron-jobs')
@UseGuards(ThrottlerGuard)
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) {}

  @Post()
  create(@Body() createCronJobDto: CreateCronJobDto) {
    return this.cronJobService.create(createCronJobDto);
  }

  @Get()
  findAll() {
    return this.cronJobService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCronJobDto: CreateCronJobDto) {
    return this.cronJobService.update(id, updateCronJobDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cronJobService.delete(id);
  }
}
