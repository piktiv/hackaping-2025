import { format, addDays, parseISO, isValid } from 'date-fns';

// Format a date as YYYY-MM-DD
export const formatDateISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format a date in a more readable format
export const formatDateReadable = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'MMM d, yyyy');
};

// Get the current date in ISO format
export const getCurrentDateISO = (): string => {
  return formatDateISO(new Date());
};

// Get a range of dates
export const getDateRange = (startDate: Date, days: number): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    dates.push(formatDateISO(addDays(startDate, i)));
  }
  return dates;
};

// Get date range for the next 14 days
export const getNext14Days = (): string[] => {
  return getDateRange(new Date(), 14);
};

// Get date range for the current month
export const getCurrentMonth = (): { startDate: string, endDate: string } => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return {
    startDate: formatDateISO(firstDay),
    endDate: formatDateISO(lastDay)
  };
};