import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { CronJob, JobHistory, api } from '../lib/api';
import { formatDate, formatTime } from '../utils/dateUtils';

interface CronJobDetailsModalProps {
  cronJobId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CronJobDetailsModal: React.FC<CronJobDetailsModalProps> = ({
  cronJobId,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cronJob, setCronJob] = useState<CronJob | null>(null);
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);

  useEffect(() => {
    if (isOpen && cronJobId) {
      loadCronJobDetails();
    }
  }, [isOpen, cronJobId]);

  const loadCronJobDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get cron job details
      const jobData = await api.getCronJob(cronJobId);
      setCronJob(jobData);
      
      // Get history for this cron job
      const historyData = await api.getJobHistory(cronJobId);
      setJobHistory(historyData);
    } catch (err) {
      setError('Failed to load cron job details');
      console.error('Error loading cron job details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-4xl max-h-screen overflow-hidden">
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isLoading ? 'Loading...' : cronJob?.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal content */}
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-pulse text-purple-400">Loading...</div>
            </div>
          ) : error ? (
            <div className="p-6 text-red-400">{error}</div>
          ) : (
            <>
              {/* Cron job details section */}
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Trigger URL</p>
                    <p className="text-white break-all">{cronJob?.triggerLink}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Schedule</p>
                    <code className="bg-gray-900 px-2 py-1 rounded text-purple-300">{cronJob?.schedule}</code>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white">{formatDate(cronJob?.startDate || '')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created At</p>
                    <p className="text-white">{formatDate(cronJob?.createdAt || '')}</p>
                  </div>
                </div>
              </div>

              {/* Job history section */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Execution History</h3>
                
                {jobHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No execution history available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobHistory.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg p-4 ${
                          entry.status === 'success' ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {entry.status === 'success' ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className={`font-medium ${
                              entry.status === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {entry.status === 'success' ? 'Success' : 'Failed'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(entry.executionTime)}</span>
                            <Clock className="h-4 w-4 ml-2 mr-1" />
                            <span>{formatTime(entry.executionTime)}</span>
                          </div>
                        </div>
                        
                        {/* Response data with collapsible details */}
                        <div className="mt-2">
                          <details className="bg-gray-900/50 rounded p-2">
                            <summary className="cursor-pointer text-gray-300 hover:text-white">
                              Response Data
                            </summary>
                            <div className="mt-2 bg-gray-900 p-3 rounded overflow-auto max-h-60">
                              {entry.response ? (
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                  {typeof entry.response === 'string' 
                                    ? entry.response 
                                    : JSON.stringify(entry.response, null, 2)}
                                </pre>
                              ) : (
                                <p className="text-gray-500 italic">No response data</p>
                              )}
                            </div>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-gray-700 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CronJobDetailsModal;