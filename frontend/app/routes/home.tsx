import { useEffect, useState } from "react";
import {
  fetchEmployees,
  fetchSchedules,
  fetchRules,
  processScheduleChange
} from "~/api";
import type {
  Employee,
  Schedule,
  Rules,
  ScheduleWithEmployee,
  ScheduleChangeRequest,
  ScheduleChangeResponse
} from "~/types";
import { DashboardCard } from "~/components/DashboardCard";
import { ScheduleTable } from "~/components/ScheduleTable";
import { ScheduleChangeForm } from "~/components/ScheduleChangeForm";
import { RequestAnalysis } from "~/components/RequestAnalysis";

export function meta() {
  return [
    { title: "Employee Scheduling App" },
    { name: "description", content: "Employee scheduling application dashboard" },
  ];
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<ScheduleWithEmployee[]>([]);
  const [rules, setRules] = useState<Rules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changeResponse, setChangeResponse] = useState<ScheduleChangeResponse | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const today = new Date();
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [employeesData, schedulesData, rulesData] = await Promise.all([
          fetchEmployees(),
          fetchSchedules(formatDate(today)),
          fetchRules()
        ]);

        setEmployees(employeesData);
        setSchedules(schedulesData.map(schedule => ({
          ...schedule,
          employee_name: employeesData.find(emp => emp.employee_number === schedule.first_line_support)?.name || 'Unknown Employee'
        })));
        setRules(rulesData);
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
    try {
      setRequestLoading(true);
      setError(null);

      const response = await processScheduleChange({ request_text: requestText });
      setChangeResponse(response);

      if (response.analysis.recommendation === 'approve' && 
          response.analysis.changes?.length > 0) {
        const schedulesData = await fetchSchedules(formatDate(today));
        setSchedules(schedulesData.map(schedule => ({
          ...schedule,
          employee_name: employees.find(emp => emp.employee_number === schedule.first_line_support)?.name || 'Unknown Employee'
        })));
      }
    } catch (err) {
      console.error('Error processing schedule change:', err);
      setError('Failed to process schedule change request.');
    } finally {
      setRequestLoading(false);
    }
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
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Employee Scheduling Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 p-3">
          {error && (
            <div className="mb-3 rounded-md bg-red-50 p-2 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Weekly Schedule"
              value={`${schedules.length} shifts`}
              description={`Today's date: ${formatDate(today)}`}
              icon="📅"
            />
            <DashboardCard
              title="Employees"
              value={employees.length.toString()}
              description="Total staff members"
              icon="👥"
            />
            <DashboardCard
              title="Scheduling Rules"
              value={rules ? `${rules.max_days_per_week} days max` : "N/A"}
              description={rules ? `${rules.preferred_balance * 100}% balance target` : "Loading..."}
              icon="📏"
            />
          </div>

          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">This Week's Schedule</h2>
            <ScheduleTable schedules={schedules} />
          </div>

          <div className="mt-4">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Schedule Change Request</h2>
            <ScheduleChangeForm
              onSubmit={handleChangeRequest}
              isLoading={requestLoading}
              response={changeResponse}
            />
            {changeResponse && <RequestAnalysis response={changeResponse} />}
          </div>
        </main>
      </div>
    </div>
  );
}
