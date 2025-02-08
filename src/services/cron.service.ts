import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob, CronJobDocument } from '../schemas/cron-job.schema';
import * as cron from 'node-cron';
import axios from 'axios';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private jobs = new Map<string, cron.ScheduledTask>();

  constructor(
    @InjectModel(CronJob.name) private cronJobModel: Model<CronJobDocument>,
  ) {}

  async scheduleCronJobs() {
    const jobs = await this.cronJobModel.find();
    jobs.forEach((job) => this.scheduleJob(job));
  }

  scheduleJob(job: CronJob) {
    const cronExpression = this.getCronExpression(job.schedule);
    if (!cronExpression) return;

    const task = cron.schedule(cronExpression, async () => {
      try {
        const response = await axios.post(
          job.url,
          {},
          { headers: { 'x-api-key': job.apiKey } },
        );
        this.logger.log(`Cron job [${job.name}] executed: ${response.status}`);
      } catch (error) {
        this.logger.error(`Cron job [${job.name}] failed: ${error.message}`);
      }
    });

    this.jobs.set(job.name, task);
  }

  private getCronExpression(schedule: string): string | null {
    switch (schedule) {
      case 'weekly':
        return '0 0 * * 0';
      case 'monthly':
        return '0 0 1 * *';
      default:
        return null;
    }
  }

  async createCronJob(data: Partial<CronJob>) {
    const job = new this.cronJobModel(data);
    await job.save();
    this.scheduleJob(job);
    return job;
  }

  async deleteCronJob(name: string) {
    await this.cronJobModel.deleteOne({ name });
    const task = this.jobs.get(name);
    if (task) {
      task.stop();
      this.jobs.delete(name);
    }
  }
}
