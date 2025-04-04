import { useEffect, useState } from "react";
import {
  fetchEmployees, fetchEvaluation,
  fetchShifts
} from "~/api";
import type {
  Employee,
  Shift, ShiftReview
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
  const [evaluation, setEvaluation] = useState<ShiftReview | null>(null)
  const [evalIsLoading, setEvalIsLoading] = useState<boolean>(false);

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

  const handleFetchEval = () => {
    setEvalIsLoading(()=>true);
    fetchEvaluation().then((result)=> {
      setEvaluation(result);
      setEvalIsLoading(()=>false);
      console.log(result);
    });
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
            {/*<ScheduleChangeForm*/}
            {/*  onSubmit={handleChangeRequest}*/}
            {/*  isLoading={requestLoading}*/}
            {/*/>*/}
            <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
                onClick={handleFetchEval}
                disabled={evalIsLoading}
            >
              {evalIsLoading ? 'Processing...' : 'Evaluate Schedule'}
            </button>
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
