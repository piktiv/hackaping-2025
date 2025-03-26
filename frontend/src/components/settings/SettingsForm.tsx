import React, { useState, useEffect } from 'react';
import { useScheduleStore } from '../../store';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Alert from '../shared/Alert';

const SettingsForm: React.FC = () => {
  const { rules, isLoading, error, fetchRules, updateRules, clearError } = useScheduleStore();

  const [formData, setFormData] = useState({
    max_days_per_week: 3,
    preferred_balance: 0.2
  });

  const [formErrors, setFormErrors] = useState({
    max_days_per_week: '',
    preferred_balance: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    setFormData({
      max_days_per_week: rules.max_days_per_week,
      preferred_balance: rules.preferred_balance
    });
  }, [rules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert to the appropriate type
    const parsedValue = name === 'preferred_balance'
      ? parseFloat(value)
      : parseInt(value, 10);

    setFormData(prev => ({ ...prev, [name]: parsedValue }));

    // Clear validation errors
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear success message on any change
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const errors = {
      max_days_per_week: '',
      preferred_balance: ''
    };
    let isValid = true;

    // Validate max_days_per_week
    if (isNaN(formData.max_days_per_week) || formData.max_days_per_week < 1 || formData.max_days_per_week > 7) {
      errors.max_days_per_week = 'Must be a number between 1 and 7';
      isValid = false;
    }

    // Validate preferred_balance
    if (isNaN(formData.preferred_balance) || formData.preferred_balance < 0 || formData.preferred_balance > 1) {
      errors.preferred_balance = 'Must be a number between 0 and 1';
      isValid = false;
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
      await updateRules({
        max_days_per_week: formData.max_days_per_week,
        preferred_balance: formData.preferred_balance
      });
      setSuccessMessage('Settings updated successfully');
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Scheduling Rules & Settings</h2>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="max_days_per_week" className="block text-sm font-medium text-gray-700">
              Maximum Days Per Week
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="max_days_per_week"
                id="max_days_per_week"
                min="1"
                max="7"
                step="1"
                className={`block w-full rounded-md border ${formErrors.max_days_per_week ? 'border-red-300' : 'border-gray-300'} shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                value={formData.max_days_per_week}
                onChange={handleChange}
              />
              {formErrors.max_days_per_week && (
                <p className="mt-1 text-sm text-red-600">{formErrors.max_days_per_week}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Maximum number of days an employee can be on first-line support per week
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="preferred_balance" className="block text-sm font-medium text-gray-700">
              Preferred Balance (0-1)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="preferred_balance"
                id="preferred_balance"
                min="0"
                max="1"
                step="0.05"
                className={`block w-full rounded-md border ${formErrors.preferred_balance ? 'border-red-300' : 'border-gray-300'} shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                value={formData.preferred_balance}
                onChange={handleChange}
              />
              {formErrors.preferred_balance && (
                <p className="mt-1 text-sm text-red-600">{formErrors.preferred_balance}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Maximum allowed difference from the average workload (as a proportion).
                For example, 0.2 means employee shifts can differ by up to 20% from the average.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={isLoading}>
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsForm;
