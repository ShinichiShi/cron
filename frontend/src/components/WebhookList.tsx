import React, { useState, useEffect } from 'react';
import { WebhookData, api } from '../lib/api';

interface WebhookListProps {
  cronJobId?: string;
  isLoading?: boolean;
}

const WebhookList: React.FC<WebhookListProps> = ({ cronJobId, isLoading: externalLoading }) => {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);

  useEffect(() => {
    loadWebhooks();
  }, [cronJobId]);

  const loadWebhooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let webhookData: WebhookData[];
      
      if (cronJobId) {
        webhookData = await api.getWebhooksByCronJob(cronJobId);
      } else {
        webhookData = await api.getWebhooks();
      }
      
      setWebhooks(webhookData);
    } catch (err) {
      console.error('Error loading webhooks:', err);
      setError('Failed to load webhook data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatData = (data: Record<string, any>) => {
    return JSON.stringify(data, null, 2);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-300">
        <div className="animate-pulse">Loading webhook data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        <div>{error}</div>
        <button 
          className="px-3 py-1 mt-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
          onClick={loadWebhooks}
        >
          Retry
        </button>
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-300">
        No webhook data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              Date Received
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              Webhook Data
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {webhooks.map((webhook) => (
            <tr key={webhook._id} className="hover:bg-gray-700">
              <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">
                {formatDate(webhook.createdAt)}
              </td>
              <td className="px-3 py-4 text-sm text-gray-300">
                <details className="cursor-pointer">
                  <summary className="text-purple-400 hover:text-purple-300">
                    View Data
                  </summary>
                  <pre className="p-2 mt-2 overflow-x-auto text-xs text-gray-300 bg-gray-900 rounded">
                    {formatData(webhook.data)}
                  </pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebhookList;