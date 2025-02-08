import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { CronController } from './controllers/cron.controller';
import { WebhookController } from './controllers/webhook.controller';
import { CronService } from './services/cron.service';
import { WebhookService } from './services/webhook.service';
import { CronJob, CronJobSchema } from './schemas/cron-job.schema';
import { WebhookData, WebhookDataSchema } from './schemas/webhook.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cronService'),
    MongooseModule.forFeature([{ name: CronJob.name, schema: CronJobSchema }]),
    MongooseModule.forFeature([{ name: WebhookData.name, schema: WebhookDataSchema }]),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }), // 10 requests per minute
  ],
  controllers: [CronController, WebhookController],
  providers: [CronService, WebhookService],
})
export class AppModule {}
