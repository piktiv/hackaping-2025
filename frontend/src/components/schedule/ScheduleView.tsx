import React, { useEffect, useState } from 'react';
import { useScheduleStore } from '../../store';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Alert from '../shared/Alert';
import { formatDateReadable, getNext14Days } from '../../utils/date';

const ScheduleView: React.FC = () => {
  const {
    schedules,
    employees,
    isLoading,
    error,
    fetchEmployees,
    fetchSchedules,
    updateSchedule,
    clearError
  } = useScheduleStore();

  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      await fetchEmployees();
      await fetchSchedules();
    };
    loadData();
  }, [fetchEmployees, fetchSchedules]);

  const handleEdit = (date: string, currentEmployeeId: string) => {
    setEditingDate(date);
    setSelectedEmployee(currentEmployeeId);
  };

  const handleSave = async () => {
    if (editingDate && selectedEmployee) {
      await updateSchedule(editingDate, {
        date: editingDate,
        first_line_support: selectedEmployee
      });
      setEditingDate(null);
      setSelectedEmployee('');
    }
  };

  const handleCancel = () => {
    setEditingDate(null);
    setSelectedEmployee('');
  };

  // Get the next 14 days for display
  const dateRange = getNext14Days();

  // Filter schedules to show only the next 14 days
  const filteredSchedules = schedules.filter(schedule =>
    dateRange.includes(schedule.date)
  ).sort((a, b) => a.date.localeCompare(b.date));

  // Create a map of dates to easily find schedules
  const scheduleMap = Object.fromEntries(
    filteredSchedules.map(schedule => [schedule.date, schedule])
  );

  if (isLoading && schedules.length === 0) {
    return <div className="text-center py-4">Loading schedule...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Schedule - Next 14 Days</h2>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First-Line Support
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dateRange.map(date => {
                const schedule = scheduleMap[date];
                const isEditing = editingDate === date;

                return (
                  <tr key={date} className={date === editingDate ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{formatDateReadable(date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={selectedEmployee}
                          onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                          <option value="">Select Employee</option>
                          {employees.map(employee => (
                            <option key={employee.employee_number} value={employee.employee_number}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {schedule ? schedule.employee_name : 'Not assigned'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={handleSave}
                            disabled={!selectedEmployee}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEdit(date, schedule?.first_line_support || '')}
                        >
                          {schedule ? 'Change' : 'Assign'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleView;
