import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface CronJob {
  _id: string;
  name: string;
  triggerLink: string;
  apiKey?: string;
  schedule: string;
  startDate: string;
  createdAt?: string;
}

export interface JobHistory {
  id: string;
  cronJobId: string;
  response: string | Record<string,unknown>;
  status: string;
  executionTime: string;
}

export const api = {
  getCronJobs: async (): Promise<CronJob[]> => {
    const response = await axios.get(`${API_BASE_URL}/cron-jobs`);
    return response.data;
  },
  
  getCronJob: async (id: string): Promise<CronJob> => {
    const response = await axios.get(`${API_BASE_URL}/cron-jobs/${id}`);
    return response.data;
  },
  
  createCronJob: async (cronJob: Omit<CronJob, '_id' | 'createdAt'>): Promise<CronJob> => {
    const response = await axios.post(`${API_BASE_URL}/cron-jobs`, cronJob);
    return response.data;
  },
  
  updateCronJob: async (id: string, cronJob: Partial<Omit<CronJob, '_id' | 'createdAt'>>): Promise<CronJob> => {
    const response = await axios.put(`${API_BASE_URL}/cron-jobs/${id}`, cronJob);
    return response.data;
  },
  
  deleteCronJob: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/cron-jobs/${id}`);
  },
  
  getJobHistory: async (cronJobId: string): Promise<JobHistory[]> => {
    const response = await axios.get(`${API_BASE_URL}/cron-jobs/${cronJobId}/history`);
    return response.data;
  }
};