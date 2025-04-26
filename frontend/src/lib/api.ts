import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface CronJob {
  id: string;
  name: string;
  triggerLink: string;
  apiKey?: string;
  schedule: string;
  startDate: string;
  createdAt?: string;
}

export const api = {
  getCronJobs: async (): Promise<CronJob[]> => {
    const response = await axios.get(`${API_BASE_URL}/cron-jobs`);
    return response.data;
  },
  
  createCronJob: async (cronJob: Omit<CronJob, 'id'>): Promise<CronJob> => {
    const response = await axios.post(`${API_BASE_URL}/cron-jobs`, cronJob);
    return response.data;
  }
};