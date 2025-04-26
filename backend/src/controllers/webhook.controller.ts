import { Controller, Post, Get, Body } from '@nestjs/common';
import { WebhookService } from '../services/webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async create(@Body() webhookData: Record<string, any>) {
    return this.webhookService.create(webhookData);
  }

  @Get()
  async getWebhooks() {
    return this.webhookService.getWebhookData();
  }
}
