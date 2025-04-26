import React from 'react';
import { Calendar, Link2, Clock } from 'lucide-react';
import { CronJob } from '../lib/api';
import { formatDate } from '../utils/dateUtils';

interface CronJobCardProps {
  cronJob: CronJob;
}

const CronJobCard: React.FC<CronJobCardProps> = ({ cronJob }) => {
  return (
    <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg transition-all duration-200 hover:shadow-purple-900/50 hover:shadow-2xl border border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-white">{cronJob.name}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-200">
            Active
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Link2 className="mr-2 h-4 w-4 text-purple-400" />
            <span className="truncate">{cronJob.triggerLink}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="mr-2 h-4 w-4 text-purple-400" />
            <code className="bg-gray-900/50 px-2 py-1 rounded text-sm text-purple-200">{cronJob.schedule}</code>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="mr-2 h-4 w-4 text-purple-400" />
            <span>{formatDate(cronJob.startDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 px-4 py-4 sm:px-6">
        <div className="flex justify-end">
          <button type="button" className="text-sm font-medium text-purple-400 hover:text-purple-300">
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CronJobCard;