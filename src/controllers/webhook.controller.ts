import { Controller, Post, Get, Body } from '@nestjs/common';
import { WebhookService } from '../services/webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async receiveData(@Body() body) {
    return this.webhookService.storeWebhookData(body);
  }

  @Get()
  async getWebhooks() {
    return this.webhookService.getWebhookData();
  }
}
