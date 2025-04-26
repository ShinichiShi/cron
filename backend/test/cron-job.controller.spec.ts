import { Test, TestingModule } from '@nestjs/testing';
import { CronJobController } from '../src/controllers/cron-job.controller';
import { CronJobService } from '../src/services/cron-job.service';

describe('CronJobController', () => {
  let controller: CronJobController;
  let service: CronJobService;

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
      controllers: [CronJobController],
      providers: [
        {
          provide: CronJobService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCronJob),
            findAll: jest.fn().mockResolvedValue([mockCronJob]),
            update: jest.fn().mockResolvedValue(mockCronJob),
            delete: jest.fn().mockResolvedValue(mockCronJob),
          },
        },
      ],
    }).compile();

    controller = module.get<CronJobController>(CronJobController);
    service = module.get<CronJobService>(CronJobService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cron job', async () => {
      const createJobDto = {
        name: 'Test Job',
        triggerLink: 'https://api.example.com/trigger',
        apiKey: 'test-api-key',
        schedule: '*/5 * * * *',
        startDate: new Date(),
      };

      const result = await controller.create(createJobDto);
      expect(result).toEqual(mockCronJob);
      expect(service.create).toHaveBeenCalledWith(createJobDto);
    });
  });
});
