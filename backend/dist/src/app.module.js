"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const cron_job_schema_1 = require("./schemas/cron-job.schema");
const webhook_schema_1 = require("./schemas/webhook.schema");
const job_history_schema_1 = require("./schemas/job-history.schema");
const cron_job_controller_1 = require("./controllers/cron-job.controller");
const cron_job_service_1 = require("./services/cron-job.service");
const webhook_controller_1 = require("./controllers/webhook.controller");
const webhook_service_1 = require("./services/webhook.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: 'CronJob', schema: cron_job_schema_1.CronJobSchema },
                { name: 'WebhookData', schema: webhook_schema_1.WebhookDataSchema },
                { name: 'JobHistory', schema: job_history_schema_1.JobHistorySchema },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60000,
                    limit: 10,
                },
            ]),
        ],
        controllers: [cron_job_controller_1.CronJobController, webhook_controller_1.WebhookController],
        providers: [cron_job_service_1.CronJobService, webhook_service_1.WebhookService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map