import { Controller, Post, Get, Param, Body, BadRequestException } from '@nestjs/common';
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
  @Get('cron-job/:id')
  async getWebhooksByCronJob(@Param('id') cronJobId: string) {
    try {
      return this.webhookService.findByCronJobId(cronJobId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
