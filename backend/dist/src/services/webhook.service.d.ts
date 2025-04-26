import { Model } from 'mongoose';
import { WebhookDataDocument } from '../schemas/webhook.schema';
export declare class WebhookService {
    private webhookModel;
    constructor(webhookModel: Model<WebhookDataDocument>);
    create(webhookData: Record<string, any>): Promise<WebhookDataDocument>;
    findAll(): Promise<WebhookDataDocument[]>;
    getWebhookData(): Promise<(import("mongoose").Document<unknown, {}, WebhookDataDocument> & import("../schemas/webhook.schema").WebhookData & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
