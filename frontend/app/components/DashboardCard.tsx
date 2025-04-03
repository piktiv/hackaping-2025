interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

export const DashboardCard = ({ title, value, description, icon }: DashboardCardProps) => (
  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
    <div className="p-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-2 w-0 flex-1">
          <dt className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{title}</dt>
          <dd>
            <div className="text-base font-semibold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
          </dd>
        </div>
      </div>
    </div>
  </div>
); 