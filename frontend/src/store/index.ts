import { create } from 'zustand';
import {
  Employee,
  EmployeeCreateRequest,
  Schedule,
  ScheduleCreateRequest,
  Rules,
  RulesUpdateRequest,
  ScheduleChangeRequest,
  ScheduleChangeResponse,
  UIState,
  ScheduleWithEmployee
} from '../types';
import * as api from '../api';

interface ScheduleStore extends UIState {
  // Employee actions
  fetchEmployees: () => Promise<void>;
  createEmployee: (employee: EmployeeCreateRequest) => Promise<void>;
  updateEmployee: (employeeNumber: string, employee: EmployeeCreateRequest) => Promise<void>;
  deleteEmployee: (employeeNumber: string) => Promise<void>;

  // Schedule actions
  fetchSchedules: (startDate?: string, endDate?: string) => Promise<void>;
  createSchedule: (schedule: ScheduleCreateRequest) => Promise<void>;
  updateSchedule: (date: string, schedule: ScheduleCreateRequest) => Promise<void>;
  deleteSchedule: (date: string) => Promise<void>;

  // Rules actions
  fetchRules: () => Promise<void>;
  updateRules: (rules: RulesUpdateRequest) => Promise<void>;

  // Schedule change actions
  processScheduleChange: (request: ScheduleChangeRequest) => Promise<ScheduleChangeResponse>;

  // Helper function
  getEmployeeInfo: (employeeNumber: string) => Employee | undefined;
  clearError: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  employees: [],
  schedules: [],
  rules: { max_days_per_week: 3, preferred_balance: 0.2 },
  isLoading: false,
  error: null,

  // Helper function to get employee info
  getEmployeeInfo: (employeeNumber: string) => {
    return get().employees.find(emp => emp.employee_number === employeeNumber);
  },

  clearError: () => set({ error: null }),

  // Employee actions
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await api.fetchEmployees();
      set({ employees, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch employees', isLoading: false });
    }
  },

  createEmployee: async (employee: EmployeeCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.createEmployee(employee);
      // Refresh the employees list
      await get().fetchEmployees();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create employee', isLoading: false });
    }
  },

  updateEmployee: async (employeeNumber: string, employee: EmployeeCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateEmployee(employeeNumber, employee);
      // Refresh the employees list
      await get().fetchEmployees();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update employee', isLoading: false });
    }
  },

  deleteEmployee: async (employeeNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteEmployee(employeeNumber);
      // Refresh the employees list
      await get().fetchEmployees();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete employee', isLoading: false });
    }
  },

  // Schedule actions
  fetchSchedules: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true, error: null });
    try {
      // First ensure we have employees loaded
      if (get().employees.length === 0) {
        await get().fetchEmployees();
      }

      const schedules = await api.fetchSchedules(startDate, endDate);

      // Augment schedules with employee names
      const schedulesWithEmployees: ScheduleWithEmployee[] = schedules.map(schedule => {
        const employee = get().employees.find(emp => emp.employee_number === schedule.first_line_support);
        return {
          ...schedule,
          employee_name: employee?.name || 'Unknown Employee'
        };
      });

      set({ schedules: schedulesWithEmployees, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch schedules', isLoading: false });
    }
  },

  createSchedule: async (schedule: ScheduleCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.createSchedule(schedule);
      // Refresh the schedules
      await get().fetchSchedules();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create schedule', isLoading: false });
    }
  },

  updateSchedule: async (date: string, schedule: ScheduleCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateSchedule(date, schedule);
      // Refresh the schedules
      await get().fetchSchedules();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update schedule', isLoading: false });
    }
  },

  deleteSchedule: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteSchedule(date);
      // Refresh the schedules
      await get().fetchSchedules();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete schedule', isLoading: false });
    }
  },

  // Rules actions
  fetchRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const rules = await api.fetchRules();
      set({ rules, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rules', isLoading: false });
    }
  },

  updateRules: async (rules: RulesUpdateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRules = await api.updateRules(rules);
      set({ rules: updatedRules, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update rules', isLoading: false });
    }
  },

  // Schedule change actions
  processScheduleChange: async (request: ScheduleChangeRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.processScheduleChange(request);
      set({ isLoading: false });

      // If the response suggests a change, refresh schedules
      if (response.analysis.recommendation === 'approve') {
        await get().fetchSchedules();
      }

      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to process schedule change',
        isLoading: false
      });
      throw error;
    }
  }
}));
