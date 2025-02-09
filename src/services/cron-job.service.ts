import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob as CronJobType } from 'cron';
import axios from 'axios';
import { CronJobDocument } from 'src/schemas/cron-job.schema';
import { JobHistory } from 'src/schemas/job-history.schema';
import { CreateCronJobDto } from 'src/dto/create-cron-job.dto';
import { CronJob } from 'src/schemas/cron-job.schema';
@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    @InjectModel('CronJob') private cronJobModel: Model<CronJobDocument>,
    @InjectModel('JobHistory') private jobHistoryModel: Model<JobHistory>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(createCronJobDto: CreateCronJobDto): Promise<CronJob> {
    const createdCronJob = await this.cronJobModel.create(createCronJobDto);
    // const savedJob = await createdCronJob.save();
    // await this.scheduleCronJob(savedJob);
    // return savedJob;
    await this.scheduleCronJob(createdCronJob);
    return createdCronJob;
  }

  private async scheduleCronJob(job: CronJobDocument) {
    const cronJob = new CronJobType(job.schedule, async () => {
      try {
        const response = await axios.get(job.triggerLink, {
          headers: { 'X-API-Key': job.apiKey },
        });

        await this.jobHistoryModel.create({
          cronJobId: job._id,
          response: JSON.stringify(response.data),
          status: 'success',
          executionTime: new Date(),
        });
      } catch (error) {
        await this.jobHistoryModel.create({
          cronJobId: job._id,
          response: error.message,
          status: 'error',
          executionTime: new Date(),
        });
      }
    });

    this.schedulerRegistry.addCronJob(job._id.toString(), cronJob);
    if (job.isActive) {
      cronJob.start();
    }
  }

  async findAll() {
    return this.cronJobModel.find().exec();
  }

  async update(id: string, updateCronJobDto: CreateCronJobDto) {
    const job = await this.cronJobModel.findByIdAndUpdate(
      id,
      updateCronJobDto,
      {
        new: true,
      },
    );
    if (job) {
      const existingJob = this.schedulerRegistry.getCronJob(id);
      existingJob.stop();
      this.schedulerRegistry.deleteCronJob(id);
      await this.scheduleCronJob(job);
    }
    return job;
  }

  async delete(id: string) {
    const job = await this.cronJobModel.findByIdAndDelete(id);
    if (job) {
      const existingJob = this.schedulerRegistry.getCronJob(id);
      existingJob.stop();
      this.schedulerRegistry.deleteCronJob(id);
    }
    return job;
  }
}
