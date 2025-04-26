import React, { useState } from 'react';
import { api } from '../lib/api';

interface CronJobFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CronJobForm: React.FC<CronJobFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    triggerLink: '',
    apiKey: '',
    schedule: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.triggerLink.trim()) {
      newErrors.triggerLink = 'Trigger URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.triggerLink)) {
      newErrors.triggerLink = 'Must be a valid URL (http:// or https://)';
    }
    
    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Schedule is required';
    } else if (!/^[*0-9,-/\s]+$/.test(formData.schedule)) {
      newErrors.schedule = 'Invalid cron schedule format';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      // Make sure we're passing the correct shape of data as expected by the API
      await api.createCronJob({
        name: formData.name,
        triggerLink: formData.triggerLink,
        apiKey: formData.apiKey,
        schedule: formData.schedule,
        startDate: startDate.toISOString()
      });
      
      setFormData({
        name: '',
        triggerLink: '',
        apiKey: '',
        schedule: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      
      onSuccess();
    } catch (error) {
      onError('Failed to create cron job. Please try again.');
      console.error('Error creating cron job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-lg shadow-purple-900/20 sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-white">Create a new Cron Job</h3>
        <div className="max-w-xl mt-2 text-sm text-gray-300">
          <p>Schedule automated tasks with precise timing control.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`shadow-sm bg-gray-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md text-white placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="Daily Database Backup"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="triggerLink" className="block text-sm font-medium text-gray-200">
                Trigger URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="triggerLink"
                  id="triggerLink"
                  value={formData.triggerLink}
                  onChange={handleChange}
                  className={`shadow-sm bg-gray-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md text-white placeholder-gray-400 ${
                    errors.triggerLink ? 'border-red-500' : ''
                  }`}
                  placeholder="https://example.com/api/backup"
                />
                {errors.triggerLink && (
                  <p className="mt-1 text-sm text-red-400">{errors.triggerLink}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200">
                API Key (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="apiKey"
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  className="block w-full text-white placeholder-gray-400 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Your API key if required"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-200">
                Schedule (Cron Expression)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="schedule"
                  id="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className={`shadow-sm bg-gray-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md text-white placeholder-gray-400 ${
                    errors.schedule ? 'border-red-500' : ''
                  }`}
                  placeholder="*/30 * * * * *"
                />
                {errors.schedule && (
                  <p className="mt-1 text-sm text-red-400">{errors.schedule}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Format: seconds minutes hours day month weekday
                </p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-200">
                Start Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`shadow-sm bg-gray-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-600 rounded-md text-white ${
                    errors.startDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800"
              onClick={() => {
                setFormData({
                  name: '',
                  triggerLink: '',
                  apiKey: '',
                  schedule: '',
                  startDate: new Date().toISOString().split('T')[0]
                });
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CronJobForm;