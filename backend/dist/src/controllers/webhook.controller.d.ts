import { WebhookService } from '../services/webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    create(webhookData: Record<string, any>): Promise<import("../schemas/webhook.schema").WebhookDataDocument>;
    getWebhooks(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/webhook.schema").WebhookDataDocument> & import("../schemas/webhook.schema").WebhookData & import("mongoose").Document<unknown, any, any> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
