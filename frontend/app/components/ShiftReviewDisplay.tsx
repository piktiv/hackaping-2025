import type { ShiftReview } from "~/types";

interface ShiftReviewDisplayProps {
  review: ShiftReview | null;
  isLoading: boolean;
}

export const ShiftReviewDisplay = ({ review, isLoading }: ShiftReviewDisplayProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="text-center text-gray-600 dark:text-gray-300">Loading evaluation...</div>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'fair':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="mt-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Schedule Evaluation</h3>
      
      <div className="mb-4">
        <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Reasoning</h4>
        <p className="text-gray-600 dark:text-gray-400">{review.reasoning}</p>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Comments</h4>
        <p className="text-gray-600 dark:text-gray-400">{review.comments}</p>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Employee Satisfaction</h4>
        <div className="space-y-2">
          {Object.entries(review.employee_satisfaction).map(([employee, score]) => (
            <div key={employee} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{employee}</span>
              <span className="text-gray-600 dark:text-gray-400">{parseInt(score*100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Overall Shift Quality</h4>
        <p className={`font-medium ${getQualityColor(review.shift_quality)}`}>
          {review.shift_quality.charAt(0).toUpperCase() + review.shift_quality.slice(1)}
        </p>
      </div>
    </div>
  );
}; 