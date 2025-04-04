// Employee Types
export interface Employee {
  name: string;
  employee_number: string;
}

export interface PostShift {
  employee_number: string;
  start: string;
  end: string;
  type: string;
}

export interface GetShift{
  employee_number: string;
  start: string;
  end: string;
  type: string;
  score: number;
  shift_id: string;
}

export interface Shift {
  employee_number: string;
  start: Date;
  end: Date;
  type: string;
  score: number;
  shift_id: string;
  resourceId: string
}

export interface ScheduleCreateRequest {
  date: string;
  first_line_support: string;
}

// API Response Types
export interface MessageResponse {
  message: string;
}

export interface UIState {
  employees: Employee[];
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
}

export interface ShiftReview {
  reasoning: string;
  comments: string;
  employee_satisfaction: Record<string, number>;
  shift_quality: 'excellent' | 'good' | 'fair' | 'poor';
}
