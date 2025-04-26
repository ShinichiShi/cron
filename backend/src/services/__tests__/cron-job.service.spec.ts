jest.mock('axios');
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJobService } from '../cron-job.service';
import { Model } from 'mongoose';
import { CronJobDocument } from '../../schemas/cron-job.schema';
import { JobHistory } from '../../schemas/job-history.schema';

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
    startDate: new Date().toISOString(),
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronJobService,
        {
          provide: getModelToken('CronJob'),
          useValue: {
            create: jest.fn().mockResolvedValue(mockCronJob),
            findByIdAndUpdate: jest.fn().mockImplementation((id, update) =>
              Promise.resolve({ ...mockCronJob, ...update })
              ),
            findById: jest.fn().mockResolvedValue(mockCronJob),
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockCronJob]),
            }),
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

    // ✅ Mock axios to prevent real HTTP calls
    (axios.get as jest.Mock).mockResolvedValue({ data: 'success' });
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
        startDate: new Date().toISOString(),
      };

      const result = await service.create(createJobDto);
      expect(result).toEqual(mockCronJob);
      expect(cronJobModel.create).toHaveBeenCalledWith(createJobDto);
    });
  });

  describe('findAll', () => {
    it('should return all cron jobs', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCronJob]);
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
      expect(result).not.toBeNull();
      if (result) {
        expect(result.name).toEqual(updateJobDto.name);
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    try {
      const job = schedulerRegistry.getCronJob('test-id');
      job.stop();
    } catch (error) {
    }
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
