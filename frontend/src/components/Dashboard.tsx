import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import CronJobForm from './CronJobForm';
import CronJobList from './CronJobList';
import Notification from './Notification';
import CronJobDetailsModal from './CronJobDetailsModal';
import EditCronJobModal from './EditCronJobModal';
import WebhookList from './WebhookList';
import { CronJob } from '../lib/api';
type NotificationType = 'success' | 'error' | 'info';

const Dashboard: React.FC = () => {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    type: 'success' as NotificationType, 
    message: '',
    isVisible: false,
  });
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Add state for edit modal
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<CronJob | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Whether to show webhook data in the dashboard
  const [showWebhooks, setShowWebhooks] = useState(false);
  const [isWebhooksLoading, setIsWebhooksLoading] = useState(false);

  useEffect(() => {
    loadCronJobs();
  }, []);

  const loadCronJobs = async () => {
    setIsLoading(true);
    try {
      const jobs = await api.getCronJobs();
      setCronJobs(jobs);
    } catch (error) {
      showNotification('error', 'Failed to load cron jobs');
      console.error('Error loading cron jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleFormSuccess = () => {
    showNotification('success', 'Cron job created successfully');
    loadCronJobs();
  };

  const handleFormError = (message: string) => {
    showNotification('error', message);
  };

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  // Add handlers for edit modal
  const handleJobEdit = (cronJob: CronJob) => {
    setSelectedJobForEdit(cronJob);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedJobForEdit(null);
  };

  const handleEditSuccess = () => {
    showNotification('success', 'Cron job updated successfully');
    loadCronJobs();
  };
  
  const toggleWebhooksView = () => {
    setShowWebhooks(prev => !prev);
    if (!showWebhooks) {
      setIsWebhooksLoading(true);
      setTimeout(() => setIsWebhooksLoading(false), 500);
    }
  };

  return (
    <div className="space-y-8">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {selectedJobId && (
        <CronJobDetailsModal
          cronJobId={selectedJobId}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      )}

      <EditCronJobModal
        cronJob={selectedJobForEdit}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditSuccess}
      />

      <div>
        <h1 className="text-2xl font-semibold text-white">Cron Job Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300">
          Create and manage your scheduled tasks with precision
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowWebhooks(false)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            !showWebhooks
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Cron Jobs
        </button>
        <button
          onClick={toggleWebhooksView}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            showWebhooks
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Webhook Data
        </button>
      </div>

      {showWebhooks ? (
        <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-lg shadow-purple-900/20 sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-700 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-white">
              Webhook Data
            </h3>
            <p className="max-w-2xl mt-1 text-sm text-gray-300">
              All received webhook data across jobs
            </p>
          </div>
          <WebhookList isLoading={isWebhooksLoading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-lg shadow-purple-900/20 sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-700 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Scheduled Jobs
                </h3>
                <p className="max-w-2xl mt-1 text-sm text-gray-300">
                  All your active and pending cron jobs
                </p>
              </div>
              <CronJobList 
                cronJobs={cronJobs} 
                isLoading={isLoading} 
                onViewDetails={handleViewDetails}
                onJobDelete={loadCronJobs}
                onJobEdit={handleJobEdit}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <CronJobForm onSuccess={handleFormSuccess} onError={handleFormError} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;