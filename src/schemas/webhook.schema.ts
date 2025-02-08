import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WebhookDataDocument = HydratedDocument<WebhookData>;

@Schema()
export class WebhookData {
  @Prop({ type: Object, required: true })
  data: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WebhookDataSchema = SchemaFactory.createForClass(WebhookData);
