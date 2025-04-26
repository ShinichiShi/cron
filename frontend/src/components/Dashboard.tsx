import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import CronJobForm from '../components/CronJobForm';
import CronJobList from '../components/CronJobList';
import Notification from '../components/Notification';
import CronJobDetailsModal from '../components/CronJobDetailsModal';
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

  return (
    <div className="space-y-8">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Details Modal */}
      {selectedJobId && (
        <CronJobDetailsModal
          cronJobId={selectedJobId}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      )}

      <div>
        <h1 className="text-2xl font-semibold text-white">Cron Job Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300">
          Create and manage your scheduled tasks with precision
        </p>
      </div>

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
            />
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