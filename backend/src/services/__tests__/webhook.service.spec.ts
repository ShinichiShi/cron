import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WebhookService } from '../webhook.service';
import { Model } from 'mongoose';
import { WebhookDataDocument } from '../../schemas/webhook.schema';

describe('WebhookService', () => {
  let service: WebhookService;
  let webhookModel: Model<WebhookDataDocument>;

  const mockWebhookData = {
    data: { message: 'test data' },
    cronJobId: 'test-job-id',
  };

  const mockWebhookModel = {
    create: jest.fn().mockResolvedValue(mockWebhookData),
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockWebhookData]),
    save: jest.fn().mockResolvedValue(mockWebhookData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: getModelToken('WebhookData'),
          useValue: mockWebhookModel,
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    webhookModel = module.get<Model<WebhookDataDocument>>(getModelToken('WebhookData'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create webhook data', async () => {
      const result = await service.create(mockWebhookData);
      expect(result).toEqual(mockWebhookData);
      expect(mockWebhookModel.create).toHaveBeenCalledWith(mockWebhookData);
    });
  });
});
