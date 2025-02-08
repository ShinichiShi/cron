import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookData, WebhookDataDocument } from '../schemas/webhook.schema';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(WebhookData.name)
    private webhookModel: Model<WebhookDataDocument>,
  ) {}

  async storeWebhookData(data: any) {
    return new this.webhookModel({ data }).save();
  }

  async getWebhookData() {
    return this.webhookModel.find();
  }
}
