import React, { useState, useEffect } from 'react';
import { CronJob, WebhookData, api } from '../lib/api';
import WebhookTester from './WebhookTester';

interface EditJobWebhookTabProps {
  cronJob: CronJob;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const EditJobWebhookTab: React.FC<EditJobWebhookTabProps> = ({ 
  cronJob, 
  onSuccess,
  onError
}) => {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (cronJob) {
      loadWebhooks();
    }
  }, [cronJob, refreshTrigger]);

  const loadWebhooks = async () => {
    if (!cronJob?._id) return;
    
    setIsLoading(true);
    try {
      const data = await api.getWebhooksByCronJob(cronJob._id);
      setWebhooks(data);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      onError?.('Failed to load webhook data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookSuccess = () => {
    onSuccess?.();
    setRefreshTrigger(prev => prev + 1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Webhook Testing</h3>
        <p className="mt-1 text-sm text-gray-300">
          Test your webhook endpoint by sending custom data
        </p>
        
        <WebhookTester 
          cronJob={cronJob} 
          onSuccess={handleWebhookSuccess}
          onError={onError}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-white">Recent Webhook Data</h3>
     
        {isLoading ? (
          <div className="py-4 text-center text-gray-300">
            <div className="animate-pulse">Loading webhook data...</div>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="py-4 text-center text-gray-300">
            No webhook data available
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {webhooks.slice(0, 5).map((webhook) => (
              <div key={webhook._id} className="p-4 border border-gray-700 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    {formatDate(webhook.createdAt)}
                  </span>
                </div>
                <details className="mt-2">
                  <summary className="text-purple-400 cursor-pointer hover:text-purple-300">
                    View Data
                  </summary>
                  <pre className="p-2 mt-2 overflow-x-auto text-xs text-gray-300 bg-gray-900 rounded">
                    {JSON.stringify(webhook.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditJobWebhookTab;