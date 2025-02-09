import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookDataDocument } from '../schemas/webhook.schema';

@Injectable()
export class WebhookService {
  constructor(@InjectModel('WebhookData') private webhookModel: Model<WebhookDataDocument>) {}

  async create(webhookData: Record<string, any>): Promise<WebhookDataDocument> {
    return this.webhookModel.create(webhookData);
  }

  async findAll(): Promise<WebhookDataDocument[]> {
    return this.webhookModel.find().exec();
  }

  async getWebhookData() {
    return this.webhookModel.find();
  }
}
