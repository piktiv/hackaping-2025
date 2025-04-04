import { useEffect, useState } from "react";
import {
  fetchEmployees,
  fetchShifts
} from "~/api";
import type {
  Employee,
  Shift
} from "~/types";
import { ScheduleChangeForm } from "~/components/ScheduleChangeForm";
import CalendarScheduler from "~/components/CalendarScheduler";

export function meta() {
  return [
    { title: "Employee Scheduling App" },
    { name: "description", content: "Employee scheduling application dashboard" },
  ];
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const today = new Date();
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [employeesData, shiftsData] = await Promise.all([
          fetchEmployees(),
          fetchShifts()
        ]);

        setEmployees(employeesData);
        setShifts(shiftsData);

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChangeRequest = async (requestText: string) => {
    console.log("ChangeRequest")
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full flex-col">
        <main className="flex-1 p-3">
          {error && (
            <div className="mb-3 rounded-md bg-red-50 p-2 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Schedule Change Request</h2>
            <ScheduleChangeForm
              onSubmit={handleChangeRequest}
              isLoading={requestLoading}
            />
          </div>

          <div className="mt-4">
            <CalendarScheduler
            employees={employees}
            shifts={shifts}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
