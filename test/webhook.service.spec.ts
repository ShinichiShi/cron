import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WebhookService } from '../src/services/webhook.service';
import { Model } from 'mongoose';
import { WebhookDataDocument } from '../src/schemas/webhook.schema';

describe('WebhookService', () => {
  let service: WebhookService;
  let webhookModel: Model<WebhookDataDocument>;

  const mockWebhookData = {
    data: { message: 'test data' },
    cronJobId: 'test-job-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: getModelToken('WebhookData'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockWebhookData),
            save: jest.fn(),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    webhookModel = module.get<Model<WebhookDataDocument>>(
      getModelToken('WebhookData'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create webhook data', async () => {
      jest
        .spyOn(webhookModel.prototype, 'save')
        .mockResolvedValue(mockWebhookData);

      const result = await service.create(mockWebhookData);
      expect(result).toEqual(mockWebhookData);
    });
  });

  describe('findAll', () => {
    it('should return all webhook data', async () => {
      const mockData = [mockWebhookData];
      jest.spyOn(webhookModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockData),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockData);
    });
  });
});
