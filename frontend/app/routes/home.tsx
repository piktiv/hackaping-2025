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
  const [changeRequest, setChangeRequest] = useState("");
  const [changeResponse, setChangeResponse] = useState<ScheduleChangeResponse | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  // Get current date and week's Monday and Sunday
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + (7 - today.getDay()));

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [employeesData, schedulesData, rulesData] = await Promise.all([
          fetchEmployees(),
          fetchSchedules(formatDate(monday), formatDate(sunday)),
          fetchRules()
        ]);

        setEmployees(employeesData);

        // Combine schedules with employee names
        const schedulesWithNames = schedulesData.map(schedule => {
          const employee = employeesData.find(emp => emp.employee_number === schedule.first_line_support);
          return {
            ...schedule,
            employee_name: employee ? employee.name : 'Unknown Employee'
          };
        });

        setSchedules(schedulesWithNames);
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

  const handleChangeRequest = async () => {
    if (!changeRequest.trim()) return;

    try {
      setRequestLoading(true);
      setError(null);

      const request: ScheduleChangeRequest = {
        request_text: changeRequest
      };

      const response = await processScheduleChange(request);
      setChangeResponse(response);

      // If the request was approved and changes were applied, refresh the schedules
      if (response.analysis.recommendation === 'approve' &&
          response.analysis.target_date &&
          response.analysis.suggested_replacement) {

        // Fetch updated schedules
        const schedulesData = await fetchSchedules(formatDate(monday), formatDate(sunday));

        // Combine schedules with employee names
        const schedulesWithNames = schedulesData.map(schedule => {
          const employee = employees.find(emp => emp.employee_number === schedule.first_line_support);
          return {
            ...schedule,
            employee_name: employee ? employee.name : 'Unknown Employee'
          };
        });

        setSchedules(schedulesWithNames);
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
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Employee Scheduling Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Weekly Schedule"
              value={`${schedules.length} shifts`}
              description={`${formatDate(monday)} - ${formatDate(sunday)}`}
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

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">This Week's Schedule</h2>
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Employee ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                      <tr key={schedule.date}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {schedule.date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {schedule.employee_name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {schedule.first_line_support}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No schedules found for this week
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Schedule Change Request</h2>
            <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <div className="mb-4">
                <label htmlFor="changeRequest" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter your request in natural language
                </label>
                <textarea
                  id="changeRequest"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Example: I need to switch my shift on Friday because I have a doctor's appointment."
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  onClick={handleChangeRequest}
                  disabled={requestLoading || !changeRequest.trim()}
                >
                  {requestLoading ? 'Processing...' : 'Submit Request'}
                </button>

                {changeResponse && changeResponse.analysis.recommendation === 'approve' && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Schedule changes applied!
                  </div>
                )}
              </div>
            </div>

            {changeResponse && (
              <div className="mt-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Request Analysis</h3>
                <dl className="mt-2 space-y-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      {changeResponse.analysis.employee_name || 'Not specified'}
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      {changeResponse.analysis.target_date || 'Not specified'}
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      {changeResponse.analysis.reason || 'Not specified'}
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommendation</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold
                        ${changeResponse.analysis.recommendation === 'approve' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          changeResponse.analysis.recommendation === 'deny' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
                        {changeResponse.analysis.recommendation.toUpperCase()}
                      </span>
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Replacement</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      {changeResponse.analysis.suggested_replacement || 'None suggested'}
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reasoning</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                      {changeResponse.analysis.reasoning}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, description, icon }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-3xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
            <dd className="mt-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
