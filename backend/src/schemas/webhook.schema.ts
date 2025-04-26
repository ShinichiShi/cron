import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type WebhookDataDocument = WebhookData & Document;

@Schema({ timestamps: true })
export class WebhookData {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  data: Record<string, any>;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'CronJob' })
  cronJobId: Types.ObjectId;
}

export const WebhookDataSchema = SchemaFactory.createForClass(WebhookData);
