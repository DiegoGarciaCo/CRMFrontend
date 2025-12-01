'use client';

interface GoalProgressCardProps {
  incomeGoal: number;
  closedVolume: number;
  pipelineVolume: number;
}

export default function GoalProgressCard({ incomeGoal, closedVolume, pipelineVolume }: GoalProgressCardProps) {
  const closedPercentage = (closedVolume / incomeGoal) * 100;
  const pipelinePercentage = ((closedVolume + pipelineVolume) / incomeGoal) * 100;
  const remaining = Math.max(0, incomeGoal - closedVolume - pipelineVolume);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Annual Production Goal</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Track your progress toward {formatCurrency(incomeGoal)}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Remaining</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(remaining)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Progress to Goal</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{pipelinePercentage.toFixed(1)}%</span>
        </div>
        
        {/* Stacked Progress Bar */}
        <div className="relative h-8 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          {/* Closed Volume */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 dark:from-emerald-600 dark:to-emerald-700"
            style={{ width: `${Math.min(closedPercentage, 100)}%` }}
          />
          {/* Pipeline Volume */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-60 transition-all duration-500 dark:from-blue-500 dark:to-blue-600"
            style={{ width: `${Math.min(pipelinePercentage, 100)}%` }}
          />
          
          {/* Progress Text */}
          {closedPercentage > 10 && (
            <div className="absolute left-0 top-0 flex h-full items-center px-3">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {closedPercentage.toFixed(0)}% Closed
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <span className="text-zinc-600 dark:text-zinc-400">Closed: {formatCurrency(closedVolume)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-60"></div>
            <span className="text-zinc-600 dark:text-zinc-400">Pipeline: {formatCurrency(pipelineVolume)}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Closed Progress</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{closedPercentage.toFixed(1)}%</div>
        </div>
        <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Total Progress</div>
          <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{pipelinePercentage.toFixed(1)}%</div>
        </div>
        <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Goal Amount</div>
          <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(incomeGoal)}</div>
        </div>
      </div>
    </div>
  );
}

