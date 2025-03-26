import React, { useState } from 'react';
import { useScheduleStore } from '../../store';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Alert from '../shared/Alert';
import { ScheduleChangeResponse } from '../../types';

const ScheduleChangeForm: React.FC = () => {
  const { isLoading, error, processScheduleChange, clearError } = useScheduleStore();

  const [requestText, setRequestText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ScheduleChangeResponse | null>(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestText.trim()) {
      setFormError('Please enter a schedule change request');
      return;
    }

    setFormError('');
    setAnalysisResult(null);

    try {
      const result = await processScheduleChange({ request_text: requestText });
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error processing request:', err);
    }
  };

  const getStatusColor = (recommendation: string) => {
    switch (recommendation) {
      case 'approve': return 'text-green-600';
      case 'deny': return 'text-red-600';
      case 'discuss': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Schedule Change Request</h2>

      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="requestText" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your request in natural language
            </label>
            <textarea
              id="requestText"
              className={`w-full rounded-md border ${formError ? 'border-red-300' : 'border-gray-300'} shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500`}
              rows={4}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="e.g., 'John can't work on Friday, October 15th because he has a doctor's appointment.'"
            />
            {formError && (
              <p className="mt-1 text-sm text-red-600">{formError}</p>
            )}
          </div>
          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Process Request'}
            </Button>
          </div>
        </form>
      </Card>

      {analysisResult && (
        <Card title="Analysis Results">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Original Request</h3>
              <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-200">
                {analysisResult.analysis.original_query || analysisResult.request}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="col-span-1">
                <h4 className="font-medium text-gray-700">Employee</h4>
                <p>{analysisResult.analysis.employee_name || 'Not specified'}</p>
              </div>
              <div className="col-span-1">
                <h4 className="font-medium text-gray-700">Date</h4>
                <p>{analysisResult.analysis.target_date || 'Not specified'}</p>
              </div>
              <div className="col-span-1">
                <h4 className="font-medium text-gray-700">Reason</h4>
                <p>{analysisResult.analysis.reason || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Suggested Replacement</h4>
              <p>{analysisResult.analysis.suggested_replacement || 'None suggested'}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Recommendation</h4>
              <p className={`font-bold uppercase ${getStatusColor(analysisResult.analysis.recommendation)}`}>
                {analysisResult.analysis.recommendation}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Reasoning</h4>
              <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-200">
                {analysisResult.analysis.reasoning}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700">AI Thought Process</h4>
              <details>
                <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                  Show AI Reasoning
                </summary>
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded border border-gray-200">
                  {analysisResult.analysis.thoughts}
                </p>
              </details>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScheduleChangeForm;
