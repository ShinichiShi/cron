/**
 * Format an ISO date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate  = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};
export const formatTime = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
/**
 * Get a human-readable description of a cron schedule
 * This is a simplified version and doesn't handle all possible cron expressions
 * @returns Human-readable description
 */
export const describeCronSchedule = (cronExpression: string): string => {
  if (!cronExpression) return 'Invalid schedule';
  
  const parts = cronExpression.split(' ');
  if (parts.length >= 6) {
    if (parts[0] === '*' && parts[1] === '*') {
      return 'Every minute';
    }
    
    if (parts[0].startsWith('*/')) {
      const seconds = parts[0].replace('*/', '');
      return `Every ${seconds} seconds`;
    }
  }
  return 'Custom schedule';
};