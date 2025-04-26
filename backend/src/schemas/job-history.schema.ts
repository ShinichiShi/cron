import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class JobHistory {
  @Prop({ required: true })
  cronJobId: string;

  @Prop()
  response: string;

  @Prop()
  status: string;

  @Prop()
  executionTime: Date;
}

export const JobHistorySchema = SchemaFactory.createForClass(JobHistory);
