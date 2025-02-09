import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJobService } from '../src/services/cron-job.service';
import { Model } from 'mongoose';
import { CronJobDocument } from '../src/schemas/cron-job.schema';
import { JobHistory } from '../src/schemas/job-history.schema';

describe('CronJobService', () => {
  let service: CronJobService;
  let cronJobModel: Model<CronJobDocument>;
  let jobHistoryModel: Model<JobHistory>;
  let schedulerRegistry: SchedulerRegistry;

  const mockCronJob = {
    _id: 'test-id',
    name: 'Test Job',
    triggerLink: 'https://api.example.com/trigger',
    apiKey: 'test-api-key',
    schedule: '*/5 * * * *',
    startDate: new Date(),
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronJobService,
        {
          provide: getModelToken('CronJob'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockCronJob),
            constructor: jest.fn().mockResolvedValue(mockCronJob),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('JobHistory'),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
            deleteCronJob: jest.fn(),
            getCronJob: jest.fn().mockReturnValue({
              stop: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CronJobService>(CronJobService);
    cronJobModel = module.get<Model<CronJobDocument>>(getModelToken('CronJob'));
    jobHistoryModel = module.get<Model<JobHistory>>(getModelToken('JobHistory'));
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cron job', async () => {
      const createJobDto = {
        name: 'Test Job',
        triggerLink: 'https://api.example.com/trigger',
        apiKey: 'test-api-key',
        schedule: '*/5 * * * *',
        startDate: new Date(),
      };

      jest.spyOn(cronJobModel, 'save').mockResolvedValue(mockCronJob as any);

      const result = await service.create(createJobDto);
      expect(result).toEqual(mockCronJob);
    });
  });

  describe('findAll', () => {
    it('should return all cron jobs', async () => {
      const mockJobs = [mockCronJob];
      jest.spyOn(cronJobModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockJobs),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockJobs);
    });
  });

  describe('update', () => {
    it('should update a cron job', async () => {
      const updateJobDto = {
        name: 'Updated Test Job',
        schedule: '*/10 * * * *',
      };

      jest.spyOn(cronJobModel, 'findByIdAndUpdate').mockResolvedValue({
        ...mockCronJob,
        ...updateJobDto,
      } as any);

      const result = await service.update('test-id', updateJobDto as any);
      expect(result.name).toEqual(updateJobDto.name);
    });
  });

  describe('delete', () => {
    it('should delete a cron job', async () => {
      jest
        .spyOn(cronJobModel, 'findByIdAndDelete')
        .mockResolvedValue(mockCronJob as any);

      const result = await service.delete('test-id');
      expect(result).toEqual(mockCronJob);
    });
  });
});
