import React, { useState, useEffect } from 'react';
import { CronJob, api } from '../lib/api';
import EditJobWebhookTab from './EditJobWebhookTab';

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
  onSave,
}) => {
  const [name, setName] = useState('');
  const [triggerLink, setTriggerLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [schedule, setSchedule] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'webhooks'>('details');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cronJob) {
      setName(cronJob.name);
      setTriggerLink(cronJob.triggerLink);
      setApiKey(cronJob.apiKey || '');
      setSchedule(cronJob.schedule);
      
      // Format date for input
      const date = new Date(cronJob.startDate);
      const formattedDate = date.toISOString().split('T')[0];
      setStartDate(formattedDate);
      
      setError(null);
    }
  }, [cronJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cronJob) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await api.updateCronJob(cronJob._id, {
        name,
        triggerLink,
        apiKey: apiKey || undefined,
        schedule,
        startDate,
      });
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Error updating cron job:', err);
      setError('Failed to update cron job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !cronJob) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-medium text-white">
              Edit Cron Job
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-700">
            <nav className="flex">
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'details'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Job Details
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'webhooks'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('webhooks')}
              >
                Webhook Testing
              </button>
            </nav>
          </div>

          <div className="px-6 py-4">
            {activeTab === 'details' ? (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 mb-4 text-sm text-red-400 bg-red-900 rounded-md bg-opacity-20">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="triggerLink" className="block text-sm font-medium text-gray-300">
                      Trigger Link
                    </label>
                    <input
                      type="url"
                      id="triggerLink"
                      value={triggerLink}
                      onChange={(e) => setTriggerLink(e.target.value)}
                      className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">
                      API Key (Optional)
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-300">
                      Schedule (Cron Expression)
                    </label>
                    <input
                      type="text"
                      id="schedule"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      placeholder="* * * * *"
                      className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full mt-1 text-white bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                      isSubmitting ? 'bg-purple-500 opacity-50' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <EditJobWebhookTab 
                cronJob={cronJob} 
                onSuccess={() => {
                  onSave();
                }}
                onError={(message) => setError(message)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCronJobModal;