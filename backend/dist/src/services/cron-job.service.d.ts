import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJobDocument } from 'src/schemas/cron-job.schema';
import { JobHistory } from 'src/schemas/job-history.schema';
import { CreateCronJobDto } from 'src/dto/create-cron-job.dto';
import { CronJob } from 'src/schemas/cron-job.schema';
export declare class CronJobService {
    private cronJobModel;
    private jobHistoryModel;
    private schedulerRegistry;
    private readonly logger;
    constructor(cronJobModel: Model<CronJobDocument>, jobHistoryModel: Model<JobHistory>, schedulerRegistry: SchedulerRegistry);
    create(createCronJobDto: CreateCronJobDto): Promise<CronJob>;
    private scheduleCronJob;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, CronJobDocument> & CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, updateCronJobDto: CreateCronJobDto): Promise<(import("mongoose").Document<unknown, {}, CronJobDocument> & CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, CronJobDocument> & CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
