import axios from 'axios';
import type {
  Employee,
  PostShift,
  MessageResponse,
  Shift,
  GetShift, ShiftReview
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

function convertDate(date: string): Date {
  let tmp = date.split(" ");
  let d = tmp[0].split("-")
  let t = tmp[1].split("-")

  const year = parseInt(d[0]) 
  const month = parseInt(d[1])
  const day = parseInt(d[2])

  const hour = parseInt(t[0])
  const minute = parseInt(t[1])
  return(new Date(year, month-1, day, hour, minute))
}
export const fetchShifts = async () => {
  const response = await api.get<GetShift[]>('/shifts');

  const tmp = response.data.map((shift) => {
    return {
      ...shift,
      start: convertDate(shift.start),
      end: convertDate(shift.end),
      resourceId: shift.employee_number
    } as Shift
  })
  console.log(tmp)
  return tmp;
};

export const fetchEvaluation = async () => {
  const resp = await api.get<ShiftReview>('/evaluate');
  return resp.data;
}