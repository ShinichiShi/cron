export declare class JobHistory {
    cronJobId: string;
    response: string;
    status: string;
    executionTime: Date;
}
export declare const JobHistorySchema: import("mongoose").Schema<JobHistory, import("mongoose").Model<JobHistory, any, any, any, import("mongoose").Document<unknown, any, JobHistory> & JobHistory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, JobHistory, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<JobHistory>> & import("mongoose").FlatRecord<JobHistory> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
