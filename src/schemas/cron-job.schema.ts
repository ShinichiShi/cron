import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CronJobDocument = CronJob & Document;

@Schema({ timestamps: true })
export class CronJob {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  triggerLink: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  schedule: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CronJobSchema = SchemaFactory.createForClass(CronJob);
