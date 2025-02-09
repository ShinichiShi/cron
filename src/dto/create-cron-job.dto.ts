import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCronJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  triggerLink: string;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;
}
