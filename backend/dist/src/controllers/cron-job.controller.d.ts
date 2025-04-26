import { CronJobService } from 'src/services/cron-job.service';
import { CreateCronJobDto } from 'src/dto/create-cron-job.dto';
export declare class CronJobController {
    private readonly cronJobService;
    constructor(cronJobService: CronJobService);
    create(createCronJobDto: CreateCronJobDto): Promise<import("../schemas/cron-job.schema").CronJob>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/cron-job.schema").CronJobDocument> & import("../schemas/cron-job.schema").CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, updateCronJobDto: CreateCronJobDto): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/cron-job.schema").CronJobDocument> & import("../schemas/cron-job.schema").CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/cron-job.schema").CronJobDocument> & import("../schemas/cron-job.schema").CronJob & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
