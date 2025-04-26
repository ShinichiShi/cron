import React, { useState } from 'react';
import { Calendar, Link2, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { CronJob, api } from '../lib/api';
import { formatDate } from '../utils/dateUtils';

interface CronJobCardProps {
  cronJob: CronJob;
  onDelete?: () => void;
  onEdit?: (cronJob: CronJob) => void;
  onViewDetails?: () => void;
}

const CronJobCard: React.FC<CronJobCardProps> = ({ 
  cronJob, 
  onDelete, 
  onEdit,
  onViewDetails 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the cron job "${cronJob.name}"?`)) {
      setIsDeleting(true);
      try {
        await api.deleteCronJob(cronJob._id);
        if (onDelete) {
          onDelete();
        }
      } catch (err) {
        setError('Failed to delete cron job');
        console.error('Error deleting cron job:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(cronJob);
    }
  };

  return (
    <div className="overflow-hidden transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-purple-900/50 hover:shadow-2xl">
      {error && (
        <div className="px-4 py-2 text-sm text-red-200 bg-red-900/50">
          {error}
          <button 
            className="ml-2 text-red-200 hover:text-white" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-white">{cronJob.name}</h3>
          <span className="px-2 py-1 text-xs font-medium text-purple-200 rounded-full bg-purple-900/50">
            Active
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Link2 className="w-4 h-4 mr-2 text-purple-400" />
            <span className="truncate">{cronJob.triggerLink}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-purple-400" />
            <code className="px-2 py-1 text-sm text-purple-200 rounded bg-gray-900/50">{cronJob.schedule}</code>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <span>{formatDate(cronJob.startDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-4 bg-gray-900/50 sm:px-6">
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            className="flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </button>
          
          <button 
            type="button" 
            className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          
          <button 
            type="button" 
            className="flex items-center text-sm font-medium text-red-400 hover:text-red-300"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CronJobCard;