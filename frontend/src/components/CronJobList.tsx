import React from 'react';
import { CronJob } from '../lib/api';
import CronJobCard from './CronJobCard';

interface CronJobListProps {
  cronJobs: CronJob[];
  isLoading: boolean;
}

const CronJobList: React.FC<CronJobListProps> = ({ cronJobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (cronJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-lg font-medium text-white">No cron jobs found</h3>
        <p className="mt-1 text-sm text-gray-300">Get started by creating a new cron job.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {cronJobs.map((job) => (
        <CronJobCard key={job.id} cronJob={job} />
      ))}
    </div>
  );
};

export default CronJobList;