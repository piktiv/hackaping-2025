import { useState } from "react";
import type { ScheduleChangeResponse } from "~/types";

interface ScheduleChangeFormProps {
  onSubmit: (request: string) => Promise<void>;
  isLoading: boolean;
  response: ScheduleChangeResponse | null;
}

export const ScheduleChangeForm = ({ onSubmit, isLoading, response }: ScheduleChangeFormProps) => {
  const [changeRequest, setChangeRequest] = useState("");

  const handleSubmit = () => {
    if (changeRequest.trim()) {
      onSubmit(changeRequest);
      setChangeRequest("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && changeRequest.length > 0) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white p-3 shadow dark:bg-gray-800">
      <div className="mb-2">
        <textarea
          id="changeRequest"
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Example: I need to switch my shift on Friday because I have a doctor's appointment."
          value={changeRequest}
          onChange={(e) => {setChangeRequest(e.target.value)}}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          onClick={handleSubmit}
          disabled={isLoading || !changeRequest.trim()}
        >
          {isLoading ? 'Processing...' : 'Submit Request'}
        </button>

        {response?.analysis.recommendation === 'approve' && (
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Schedule changes applied!
          </div>
        )}
      </div>
    </div>
  );
}; 