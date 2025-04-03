import type { ScheduleWithEmployee } from "~/types";

interface ScheduleTableProps {
  schedules: ScheduleWithEmployee[];
}

export const ScheduleTable = ({ schedules }: ScheduleTableProps) => (
  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Date
          </th>
          <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Employee
          </th>
          <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Employee ID
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <tr key={schedule.date}>
              <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                {schedule.date}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                {schedule.employee_name}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                {schedule.first_line_support}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
              No schedules found for this week
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
); 