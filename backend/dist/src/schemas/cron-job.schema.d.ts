import { Document, Types } from 'mongoose';
export type CronJobDocument = CronJob & Document;
export declare class CronJob {
    _id: Types.ObjectId;
    name: string;
    triggerLink: string;
    apiKey?: string;
    schedule: string;
    startDate: Date;
    isActive: boolean;
}
export declare const CronJobSchema: import("mongoose").Schema<CronJob, import("mongoose").Model<CronJob, any, any, any, Document<unknown, any, CronJob> & CronJob & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CronJob, Document<unknown, {}, import("mongoose").FlatRecord<CronJob>> & import("mongoose").FlatRecord<CronJob> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
