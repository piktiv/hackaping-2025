import type { ScheduleChangeResponse } from "~/types";

interface RequestAnalysisProps {
  response: ScheduleChangeResponse;
}

export const RequestAnalysis = ({ response }: RequestAnalysisProps) => (
  <div className="mt-2 rounded-lg bg-white p-3 shadow dark:bg-gray-800">
    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Request Analysis</h3>
    <dl className="mt-1 space-y-1">
      <div className="sm:grid sm:grid-cols-3 sm:gap-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Reason</dt>
        <dd className="text-xs text-gray-900 dark:text-gray-300 sm:col-span-2">
          {response.analysis.reason || 'Not specified'}
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Recommendation</dt>
        <dd className="text-xs text-gray-900 dark:text-gray-300 sm:col-span-2">
          <span className={`inline-flex rounded-full px-1.5 text-xs font-semibold
            ${response.analysis.recommendation === 'approve' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
              response.analysis.recommendation === 'deny' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
            {response.analysis.recommendation.toUpperCase()}
          </span>
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Changes</dt>
        <dd className="text-xs text-gray-900 dark:text-gray-300 sm:col-span-2">
          {response.analysis.changes && response.analysis.changes.length > 0 ? (
            <ul className="list-inside list-disc">
              {response.analysis.changes.map((change, index) => (
                <li key={index}>
                  Date: {change.target_date}, Replacement: {change.suggested_replacement || 'None'}
                </li>
              ))}
            </ul>
          ) : (
            'No changes specified'
          )}
        </dd>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Reasoning</dt>
        <dd className="text-xs text-gray-900 dark:text-gray-300 sm:col-span-2">
          {response.analysis.reasoning}
        </dd>
      </div>
    </dl>
  </div>
); 