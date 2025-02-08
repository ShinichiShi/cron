import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CronJobDocument = HydratedDocument<CronJob>;

@Schema()
export class CronJob {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  schedule: string; // "weekly", "monthly", etc.

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CronJobSchema = SchemaFactory.createForClass(CronJob);
