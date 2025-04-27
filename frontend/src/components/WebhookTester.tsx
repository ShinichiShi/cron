import React, { useState } from 'react';
import { api, CronJob } from '../lib/api';

interface WebhookTesterProps {
  cronJob: CronJob;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const WebhookTester: React.FC<WebhookTesterProps> = ({ cronJob, onSuccess, onError }) => {
  const [jsonData, setJsonData] = useState('{\n  "key": "value"\n}');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateJson = (json: string): boolean => {
    try {
      JSON.parse(json);
      setIsValid(true);
      return true;
    } catch (error) {
      setIsValid(false);
      return false;
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonData(newValue);
    if (newValue.trim()) {
      validateJson(newValue);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJson(jsonData)) {
      onError?.('Invalid JSON data');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const parsedData = JSON.parse(jsonData);
      
      await api.createWebhook({
        data: parsedData,
        cronJobId: cronJob._id
      });
      
      setJsonData('{\n  "key": "value"\n}');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting webhook data:', error);
      onError?.('Failed to submit webhook data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 mt-4 bg-gray-800 border border-gray-700 rounded-lg">
      <h3 className="text-lg font-medium text-white">Test Webhook</h3>
      <p className="mt-1 text-sm text-gray-300">
        Send test webhook data for this cron job
      </p>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="webhookData" className="block text-sm font-medium text-gray-300">
            JSON Data
          </label>
          <textarea
            id="webhookData"
            rows={6}
            className={`mt-1 block w-full rounded-md bg-gray-700 border ${
              isValid ? 'border-gray-600' : 'border-red-500'
            } text-white p-2 text-sm font-mono focus:ring-purple-500 focus:border-purple-500`}
            placeholder="Enter JSON data"
            value={jsonData}
            onChange={handleJsonChange}
          />
          {!isValid && (
            <p className="mt-1 text-sm text-red-500">
              Invalid JSON format
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isSubmitting || !isValid
                ? 'bg-purple-500 opacity-50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Webhook Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebhookTester;