import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { useScheduleStore } from '../../store';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Alert from '../shared/Alert';
import { formatDateReadable } from '../../utils/date';

const Dashboard: React.FC = () => {
  const {
    employees,
    schedules,
    rules,
    isLoading,
    error,
    fetchEmployees,
    fetchSchedules,
    fetchRules,
    clearError
  } = useScheduleStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchEmployees(),
        fetchSchedules(),
        fetchRules()
      ]);
    };
    loadData();
  }, [fetchEmployees, fetchSchedules, fetchRules]);

  // Get today's schedule
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = schedules.find(s => s.date === today);

  // Get this week's schedules (next 7 days)
  const nextWeekSchedules = schedules
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7);

  // Calculate workload distribution
  const avgWorkload = employees.length > 0
    ? employees.reduce((sum, emp) => sum + emp.first_line_support_count, 0) / employees.length
    : 0;

  // Identify employees with too many or too few shifts
  const maxDifference = avgWorkload * rules.preferred_balance;
  const workloadDistribution = employees.map(emp => ({
    ...emp,
    isBalanced: Math.abs(emp.first_line_support_count - avgWorkload) <= maxDifference
  }));

  if (isLoading && (employees.length === 0 || schedules.length === 0)) {
    return <div className="text-center py-4">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Today's First-Line Support">
          {todaySchedule ? (
            <div className="text-center py-3">
              <div className="text-xl font-bold text-blue-600 mb-1">{todaySchedule.employee_name}</div>
              <div className="text-sm text-gray-500">{formatDateReadable(today)}</div>
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p>No one assigned for today</p>
              <Link to="/schedule">
                <Button variant="primary" size="sm" className="mt-2">Assign Someone</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card title="Scheduling Rules">
          <div className="space-y-3 py-2">
            <div>
              <div className="text-sm text-gray-500">Max Days Per Week</div>
              <div className="font-medium">{rules.max_days_per_week} days</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Preferred Balance</div>
              <div className="font-medium">{rules.preferred_balance * 100}% from average</div>
            </div>
            <div className="pt-2">
              <Link to="/settings">
                <Button variant="secondary" size="sm">Update Rules</Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3 py-2">
            <Link to="/schedule">
              <Button variant="primary" size="sm" fullWidth>View/Edit Schedule</Button>
            </Link>
            <Link to="/employees">
              <Button variant="secondary" size="sm" fullWidth>Manage Employees</Button>
            </Link>
            <Link to="/requests">
              <Button variant="secondary" size="sm" fullWidth>Schedule Change Request</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Upcoming Schedule">
          {nextWeekSchedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nextWeekSchedules.map((schedule) => (
                    <tr key={schedule.date}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatDateReadable(schedule.date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {schedule.employee_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p>No upcoming schedules</p>
            </div>
          )}
        </Card>

        <Card title="Workload Distribution">
          {workloadDistribution.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shifts
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workloadDistribution.map((emp) => (
                    <tr key={emp.employee_number}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {emp.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {emp.first_line_support_count}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          emp.isBalanced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {emp.isBalanced ? 'Balanced' : 'Unbalanced'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs text-gray-500 mt-3">
                Average: {avgWorkload.toFixed(1)} shifts per employee
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-gray-500">
              <p>No employees to show</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
