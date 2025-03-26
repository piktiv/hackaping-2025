import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { useScheduleStore } from '../../store';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Alert from '../shared/Alert';

const EmployeeList: React.FC = () => {
  const {
    employees,
    isLoading,
    error,
    fetchEmployees,
    deleteEmployee,
    clearError
  } = useScheduleStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (employeeNumber: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteEmployee(employeeNumber);
    }
  };

  if (isLoading && employees.length === 0) {
    return <div className="text-center py-4">Loading employees...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Employees</h2>
        <Link to="/employees/new">
          <Button variant="primary">Add Employee</Button>
        </Link>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      {employees.length === 0 ? (
        <Card>
          <div className="text-center py-4 text-gray-500">
            No employees found. Add your first employee to get started.
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Support Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Known Absences
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.employee_number}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.employee_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.first_line_support_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.known_absences.length > 0
                          ? employee.known_absences.join(', ')
                          : 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/employees/${employee.employee_number}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(employee.employee_number, employee.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployeeList;
