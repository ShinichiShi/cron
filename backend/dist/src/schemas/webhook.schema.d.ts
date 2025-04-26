import { Document, Types } from 'mongoose';
export type WebhookDataDocument = WebhookData & Document;
export declare class WebhookData {
    _id: Types.ObjectId;
    data: Record<string, any>;
    cronJobId: Types.ObjectId;
}
export declare const WebhookDataSchema: import("mongoose").Schema<WebhookData, import("mongoose").Model<WebhookData, any, any, any, Document<unknown, any, WebhookData> & WebhookData & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WebhookData, Document<unknown, {}, import("mongoose").FlatRecord<WebhookData>> & import("mongoose").FlatRecord<WebhookData> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
