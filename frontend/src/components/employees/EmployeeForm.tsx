import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useScheduleStore } from '../../store';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Alert from '../shared/Alert';
import { formatDateISO } from '../../utils/date';

const EmployeeForm: React.FC = () => {
  const { employeeNumber } = useParams<{ employeeNumber: string }>();
  const navigate = useNavigate();
  const {
    employees,
    isLoading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    clearError
  } = useScheduleStore();

  const [formData, setFormData] = useState({
    name: '',
    employee_number: '',
    known_absences: [] as string[],
  });
  const [newAbsence, setNewAbsence] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    employee_number: '',
  });

  const isEditing = Boolean(employeeNumber);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (isEditing && employees.length > 0) {
      const employee = employees.find(e => e.employee_number === employeeNumber);
      if (employee) {
        setFormData({
          name: employee.name,
          employee_number: employee.employee_number,
          known_absences: employee.known_absences,
        });
      }
    }
  }, [isEditing, employees, employeeNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation errors
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddAbsence = () => {
    if (newAbsence && !formData.known_absences.includes(newAbsence)) {
      setFormData(prev => ({
        ...prev,
        known_absences: [...prev.known_absences, newAbsence]
      }));
      setNewAbsence('');
    }
  };

  const handleRemoveAbsence = (date: string) => {
    setFormData(prev => ({
      ...prev,
      known_absences: prev.known_absences.filter(d => d !== date)
    }));
  };

  const validateForm = () => {
    const errors = {
      name: '',
      employee_number: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.employee_number.trim()) {
      errors.employee_number = 'Employee ID is required';
      isValid = false;
    } else if (!isEditing) {
      // Check if employee ID is unique (only for new employees)
      const exists = employees.some(e => e.employee_number === formData.employee_number);
      if (exists) {
        errors.employee_number = 'This Employee ID is already in use';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateEmployee(employeeNumber!, {
          name: formData.name,
          employee_number: formData.employee_number,
          known_absences: formData.known_absences
        });
      } else {
        await createEmployee({
          name: formData.name,
          employee_number: formData.employee_number,
          known_absences: formData.known_absences
        });
      }
      navigate('/employees');
    } catch (err) {
      console.error('Failed to save employee:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Employee' : 'Add New Employee'}
      </h2>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={`mt-1 block w-full rounded-md border ${formErrors.name ? 'border-red-300' : 'border-gray-300'} shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="employee_number" className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              name="employee_number"
              id="employee_number"
              className={`mt-1 block w-full rounded-md border ${formErrors.employee_number ? 'border-red-300' : 'border-gray-300'} shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
              value={formData.employee_number}
              onChange={handleChange}
              disabled={isEditing} // Can't change ID if editing
            />
            {formErrors.employee_number && (
              <p className="mt-1 text-sm text-red-600">{formErrors.employee_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Known Absences
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newAbsence}
                onChange={(e) => setNewAbsence(e.target.value)}
                min={formatDateISO(new Date())}
              />
              <Button
                type="button"
                onClick={handleAddAbsence}
                disabled={!newAbsence}
                variant="secondary"
              >
                Add
              </Button>
            </div>

            {formData.known_absences.length > 0 ? (
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <ul className="space-y-1">
                  {formData.known_absences.sort().map(date => (
                    <li key={date} className="flex justify-between items-center text-sm">
                      <span>{date}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAbsence(date)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No absences added</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Update Employee' : 'Create Employee'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmployeeForm;
