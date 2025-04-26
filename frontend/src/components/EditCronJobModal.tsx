import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CronJob, api } from '../lib/api';

interface EditCronJobModalProps {
  cronJob: CronJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditCronJobModal: React.FC<EditCronJobModalProps> = ({ 
  cronJob, 
  isOpen, 
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<CronJob>>({
    name: '',
    triggerLink: '',
    schedule: '',
    startDate: '',
    apiKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cronJob) {
      setFormData({
        name: cronJob.name,
        triggerLink: cronJob.triggerLink,
        schedule: cronJob.schedule,
        startDate: cronJob.startDate.split('T')[0], // Format date for input
        apiKey: cronJob.apiKey || ''
      });
    }
  }, [cronJob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cronJob) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await api.updateCronJob(cronJob._id, formData);
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to update cron job');
      console.error('Error updating cron job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Edit Cron Job</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-200 rounded bg-red-900/50">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="triggerLink" className="block mb-1 text-sm font-medium text-gray-300">
              Trigger URL
            </label>
            <input
              type="url"
              id="triggerLink"
              name="triggerLink"
              value={formData.triggerLink}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="schedule" className="block mb-1 text-sm font-medium text-gray-300">
              Cron Schedule
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="*/5 * * * *"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="apiKey" className="block mb-1 text-sm font-medium text-gray-300">
              API Key (optional)
            </label>
            <input
              type="text"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCronJobModal;