import React, { useState, useEffect } from 'react';
import { api, CronJob } from '../lib/api';
import CronJobList from './CronJobList';
import CronJobForm from './CronJobForm';
import Notification, { NotificationType } from './Notification';

const Dashboard: React.FC = () => {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  const fetchCronJobs = async () => {
    setIsLoading(true);
    try {
      const jobs = await api.getCronJobs();
      setCronJobs(jobs);
    } catch (error) {
      console.error('Error fetching cron jobs:', error);
      showNotification('error', 'Failed to load cron jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCronJobs();
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleFormSuccess = () => {
    fetchCronJobs();
    showNotification('success', 'Cron job created successfully!');
  };

  const handleFormError = (message: string) => {
    showNotification('error', message);
  };

  return (
    <div className="space-y-8">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <div>
        <h1 className="text-2xl font-semibold text-white">Cron Job Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300">
          Create and manage your scheduled tasks with precision
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 shadow-lg shadow-purple-900/20 overflow-hidden sm:rounded-lg border border-gray-700">
            <div className="px-4 py-5 border-b border-gray-700 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">
                Scheduled Jobs
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-300">
                All your active and pending cron jobs
              </p>
            </div>
            <CronJobList cronJobs={cronJobs} isLoading={isLoading} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <CronJobForm onSuccess={handleFormSuccess} onError={handleFormError} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;