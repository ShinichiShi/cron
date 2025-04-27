import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WebhookDataDocument } from '../schemas/webhook.schema';

@Injectable()
export class WebhookService {
  constructor(@InjectModel('WebhookData') private webhookModel: Model<WebhookDataDocument>) {}

  async create(webhookData: Record<string, any>): Promise<WebhookDataDocument> {
    try {
      // Ensure the cronJobId is present and valid
      if (!webhookData.cronJobId) {
        throw new BadRequestException('cronJobId is required');
      }
      
      // Validate cronJobId is a valid ObjectId
      if (!Types.ObjectId.isValid(webhookData.cronJobId)) {
        throw new BadRequestException('Invalid cronJobId format');
      }
      
      // Structure the data according to schema requirements
      const data = {
        data: webhookData.data || {},
        cronJobId: new Types.ObjectId(webhookData.cronJobId)
      };
      
      return this.webhookModel.create(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create webhook data: ' + error.message);
    }
  }

  async findAll(): Promise<WebhookDataDocument[]> {
    return this.webhookModel.find().sort({ createdAt: -1 }).exec();
  }

  async getWebhookData() {
    return this.webhookModel.find().sort({ createdAt: -1 });
  }
  
  async findByCronJobId(cronJobId: string): Promise<WebhookDataDocument[]> {
    // Validate cronJobId is a valid ObjectId
    if (!Types.ObjectId.isValid(cronJobId)) {
      throw new BadRequestException('Invalid cronJobId format');
    }
    
    return this.webhookModel.find({ 
      cronJobId: new Types.ObjectId(cronJobId) 
    }).sort({ createdAt: -1 }).exec();
  }
}