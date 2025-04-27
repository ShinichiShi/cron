import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { CronJob, JobHistory, api } from '../lib/api';
import WebhookList from './WebhookList';

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
  const [cronJob, setCronJob] = useState<CronJob | null>(null);
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'webhooks'>('history');

  useEffect(() => {
    if (isOpen && cronJobId) {
      loadData();
    }
  }, [isOpen, cronJobId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobData, historyData] = await Promise.all([
        api.getCronJob(cronJobId),
        api.getJobHistory(cronJobId),
      ]);
      setCronJob(jobData);
      setJobHistory(historyData);
    } catch (error) {
      console.error('Error loading cron job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center px-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-medium text-white">
              {isLoading ? 'Loading...' : cronJob?.name || 'Cron Job Details'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={24} />
            </button>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 rounded-full border-t-purple-500 animate-spin" />
              <p className="mt-2 text-gray-400">Loading job details...</p>
            </div>
          ) : cronJob ? (
            <>
              <div className="p-6 border-b border-gray-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Schedule</h4>
                    <p className="mt-1 text-white">{cronJob.schedule}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Start Date</h4>
                    <p className="mt-1 text-white">{formatDate(cronJob.startDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Trigger Link</h4>
                    <p className="mt-1 text-sm text-purple-400 truncate">{cronJob.triggerLink}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Created</h4>
                    <p className="mt-1 text-white">{cronJob.createdAt ? formatDate(cronJob.createdAt) : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-700">
                <nav className="flex">
                  <button
                    className={`px-4 py-2 font-medium text-sm border-b-2 ${
                      activeTab === 'history'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('history')}
                  >
                    Execution History
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm border-b-2 ${
                      activeTab === 'webhooks'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('webhooks')}
                  >
                    Webhook Data
                  </button>
                </nav>
              </div>

              <div className="px-6 py-4 overflow-y-auto max-h-96">
                {activeTab === 'history' ? (
                  jobHistory.length > 0 ? (
                    <div className="space-y-4">
                      {jobHistory.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 ${
                            entry.status.toLowerCase() === 'success' ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {entry.status.toLowerCase() === 'success' ? (
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                              )}
                              <span className={`font-medium ${
                                entry.status.toLowerCase() === 'success' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {entry.status.toLowerCase() === 'success' ? 'Success' : 'Failed'}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formatDate(entry.executionTime)}</span>
                              <Clock className="w-4 h-4 ml-2 mr-1" />
                              <span>{formatTime(entry.executionTime)}</span>
                            </div>
                          </div>
                          
                          {/* Response data with collapsible details */}
                          <div className="mt-2">
                            <details className="p-2 rounded bg-gray-900/50">
                              <summary className="text-gray-300 cursor-pointer hover:text-white">
                                Response Data
                              </summary>
                              <div className="p-3 mt-2 overflow-auto bg-gray-900 rounded max-h-60">
                                {entry.response ? (
                                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                    {typeof entry.response === 'string' 
                                      ? entry.response 
                                      : JSON.stringify(entry.response, null, 2)}
                                  </pre>
                                ) : (
                                  <p className="italic text-gray-500">No response data</p>
                                )}
                              </div>
                            </details>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      No execution history available for this job
                    </div>
                  )
                ) : (
                  <WebhookList cronJobId={cronJobId} />
                )}
              </div>
            </>
          ) : (
            <div className="px-6 py-10 text-center text-red-400">
              <p>Failed to load job details.</p>
            </div>
          )}

          <div className="px-6 py-4 text-right bg-gray-900">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronJobDetailsModal;