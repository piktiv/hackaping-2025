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

export interface GetShift extends PostShift{
  score: number;
  shift_id: string;
}

export interface ScheduleCreateRequest {
  date: string;
  first_line_support: string;
}

// Rules Types
export interface Rules {
  max_days_per_week: number;
  preferred_balance: number;
}

export interface RulesUpdateRequest {
  max_days_per_week?: number;
  preferred_balance?: number;
}

export interface ScheduleChange {
  target_date: string;
  suggested_replacement: string;
}

// Schedule Change Types
export interface ScheduleChangeAnalysis {
  thoughts: string;
  original_query: string;
  reason?: string;
  changes: ScheduleChange[];
  recommendation: 'approve' | 'deny' | 'discuss';
  reasoning: string;
}

export interface ScheduleChangeRequest {
  request_text: string;
  metadata?: Record<string, any>;
}

export interface ScheduleChangeResponse {
  request: string;
  analysis: ScheduleChangeAnalysis;
}

// API Response Types
export interface MessageResponse {
  message: string;
}

export interface UIState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
}
