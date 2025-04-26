import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCronJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  triggerLink: string;

  @IsOptional()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;
}
