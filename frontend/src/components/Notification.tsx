import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  type, 
  message, 
  isVisible, 
  onClose 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-purple-900/90 border-purple-500'
    : type === 'error' 
      ? 'bg-red-900/90 border-red-500'
      : 'bg-blue-900/90 border-blue-500';
  
  const textColor = type === 'success' 
    ? 'text-purple-100'
    : type === 'error' 
      ? 'text-red-100'
      : 'text-blue-100';

  const Icon = type === 'success' 
    ? CheckCircle
    : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border-l-4 backdrop-blur-sm ${bgColor} transform transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${type === 'success' ? 'text-purple-300' : type === 'error' ? 'text-red-300' : 'text-blue-300'}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex ${textColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;