import axios from 'axios';
import type {
  Employee,
  PostShift,
  MessageResponse,
  GetShift
} from '~/types';

const API_URL = 'http://localhost:3000/api';

// Create request/response logger
const logRequest = (config: any) => {
  console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
  return config;
};

const logResponse = (response: any) => {
  console.log(`Response: ${response.status} ${response.config.url}`, response.data);
  return response;
};

const logError = (error: any) => {
  console.error('API Error:', error.response?.status, error.response?.data || error.message);
  return Promise.reject(error);
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response logging
api.interceptors.request.use(logRequest, logError);
api.interceptors.response.use(logResponse, logError);

// Employee API calls
export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees');
  return response.data;
};

// Schedule API calls
export const postShift = async () => {

  const shift: PostShift = {
    employee_number: "EMP001",
    end: "2025-04-04 14-00",
    start: "2025-04-04 13-00",
    type: "work"
  }
  
  const response = await api.post<PostShift[]>('/shifts', shift);
  console.log(response.data);
};

export const getShifts = async (startDate?: string, endDate?: string) => {
  const response = await api.get<GetShift[]>('/shifts');
  console.log(response.data);
};