"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CronJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const axios_1 = require("axios");
let CronJobService = CronJobService_1 = class CronJobService {
    constructor(cronJobModel, jobHistoryModel, schedulerRegistry) {
        this.cronJobModel = cronJobModel;
        this.jobHistoryModel = jobHistoryModel;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(CronJobService_1.name);
    }
    async create(createCronJobDto) {
        const createdCronJob = await this.cronJobModel.create(createCronJobDto);
        await this.scheduleCronJob(createdCronJob);
        return createdCronJob;
    }
    async scheduleCronJob(job) {
        const cronJob = new cron_1.CronJob(job.schedule, async () => {
            try {
                const requestConfig = {};
                if (job.apiKey && job.apiKey.trim() !== '') {
                    requestConfig['headers'] = { 'X-API-Key': job.apiKey };
                }
                const response = await axios_1.default.get(job.triggerLink, requestConfig);
                await this.jobHistoryModel.create({
                    cronJobId: job._id,
                    response: JSON.stringify(response.data),
                    status: 'success',
                    executionTime: new Date(),
                });
            }
            catch (error) {
                await this.jobHistoryModel.create({
                    cronJobId: job._id,
                    response: error.message,
                    status: 'error',
                    executionTime: new Date(),
                });
            }
        });
        this.schedulerRegistry.addCronJob(job._id.toString(), cronJob);
        if (job.isActive) {
            cronJob.start();
        }
    }
    async findAll() {
        return this.cronJobModel.find().exec();
    }
    async update(id, updateCronJobDto) {
        const job = await this.cronJobModel.findByIdAndUpdate(id, updateCronJobDto, {
            new: true,
        });
        if (job) {
            const existingJob = this.schedulerRegistry.getCronJob(id);
            existingJob.stop();
            this.schedulerRegistry.deleteCronJob(id);
            await this.scheduleCronJob(job);
        }
        return job;
    }
    async delete(id) {
        const job = await this.cronJobModel.findByIdAndDelete(id);
        if (job) {
            const existingJob = this.schedulerRegistry.getCronJob(id);
            existingJob.stop();
            this.schedulerRegistry.deleteCronJob(id);
        }
        return job;
    }
};
exports.CronJobService = CronJobService;
exports.CronJobService = CronJobService = CronJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('CronJob')),
    __param(1, (0, mongoose_1.InjectModel)('JobHistory')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        schedule_1.SchedulerRegistry])
], CronJobService);
//# sourceMappingURL=cron-job.service.js.map