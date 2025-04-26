import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class CronJobService implements OnModuleInit  {
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
  async onModuleInit() {
    const jobs = await this.cronJobModel.find().exec();
    this.logger.log(`Loading ${jobs.length} cron jobs from database`);
    for (const job of jobs) {
      try {
        await this.scheduleCronJob(job);
        this.logger.log(`Scheduled job: ${job.name} (${job._id})`);
      } catch (error) {
        this.logger.error(`Failed to schedule job ${job._id}: ${error.message}`);
      }
    }
  }
  private async scheduleCronJob(job: CronJobDocument) {
    const cronJob = new CronJobType(job.schedule, async () => {
      try {
        const requestConfig = {};
        if (job.apiKey && job.apiKey.trim() !== '') {
          requestConfig['headers'] = { 'X-API-Key': job.apiKey };
        }
        const response = await axios.get(job.triggerLink, requestConfig);
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
  async findOne(id: string) {
    return this.cronJobModel.findById(id).exec();
  }
  
  async getJobHistory(cronJobId: string) {
    return this.jobHistoryModel.find({ cronJobId }).sort({ executionTime: -1 }).exec();
  }
  async update(id: string, updateCronJobDto: CreateCronJobDto) {
    const job = await this.cronJobModel.findByIdAndUpdate(
      id,
      updateCronJobDto,
      { new: true },
    );
    if (job) {
      try {
        const existingJob = this.schedulerRegistry.getCronJob(id);
        existingJob.stop();
        this.schedulerRegistry.deleteCronJob(id);
      } catch (error) {
        this.logger.warn(`Cron job ${id} wasn't found in registry during update`,error);
      }
      await this.scheduleCronJob(job);
    }
    return job;
  }

  async delete(id: string) {
    const job = await this.cronJobModel.findByIdAndDelete(id);
    if (job) {
      try {
        const existingJob = this.schedulerRegistry.getCronJob(id);
        existingJob.stop();
        this.schedulerRegistry.deleteCronJob(id);
      } catch (error) {
        this.logger.warn(`Cron job ${id} wasn't found in registry during deletion`,error);
      }
    }
    return job;
  }
}
