import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { CronJobSchema } from './schemas/cron-job.schema';
import { WebhookDataSchema } from './schemas/webhook.schema';
import { JobHistorySchema } from './schemas/job-history.schema';
import { CronJobController } from './controllers/cron-job.controller';
import { CronJobService } from './services/cron-job.service';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    MongooseModule.forFeature([
      { name: 'CronJob', schema: CronJobSchema },
      { name: 'WebhookData', schema: WebhookDataSchema },
      { name: 'JobHistory', schema: JobHistorySchema },
    ]),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [CronJobController, WebhookController],
  providers: [CronJobService, WebhookService],
  exports: [WebhookService],
})
export class AppModule {}
