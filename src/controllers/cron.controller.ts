import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CronService } from '../services/cron.service';
import { Throttle } from '@nestjs/throttler';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post()
  @Throttle(5, 60) // 5 requests per minute
  async createCronJob(@Body() body) {
    return this.cronService.createCronJob(body);
  }

  @Delete(':name')
  async deleteCronJob(@Param('name') name: string) {
    return this.cronService.deleteCronJob(name);
  }

  @Get()
  async getAllCronJobs() {
    return this.cronService.scheduleCronJobs();
  }
}
