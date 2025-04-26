import React from 'react';
import { CronJob } from '../lib/api';
import CronJobCard from './CronJobCard';

interface CronJobListProps {
  cronJobs: CronJob[];
  isLoading: boolean;
  onViewDetails: (jobId: string) => void;
  onJobDelete: () => void;
  onJobEdit: (cronJob: CronJob) => void;
}

const CronJobList: React.FC<CronJobListProps> = ({ 
  cronJobs, 
  isLoading,
  onViewDetails,
  onJobDelete,
  onJobEdit
}) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-400">
        <div className="animate-pulse">Loading cron jobs...</div>
      </div>
    );
  }

  if (cronJobs.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>No cron jobs found. Create your first job to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {cronJobs.map((job) => {
      console.log(job._id, job.name, job.schedule, job.startDate, job.triggerLink, job.apiKey, job.createdAt);
      return (
        <CronJobCard 
        key={job._id} 
        cronJob={job} 
        onDelete={onJobDelete}
        onViewDetails={() => onViewDetails(job._id)}
        onEdit={onJobEdit}
        />
      );
      })}
    </div>
  );
};

export default CronJobList;