import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up'
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-red-600 dark:text-red-500'
                }`}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-500">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

