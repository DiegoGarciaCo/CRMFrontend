'use client';

interface GoalInsightsPanelProps {
  incomeGoal: number;
  closedVolume: number;
  pipelineVolume: number;
  monthsPassed: number;
  totalMonths: number;
  averageSalePrice: number;
  previousAverageSalePrice?: number;
}

export default function GoalInsightsPanel({
  incomeGoal,
  closedVolume,
  pipelineVolume,
  monthsPassed,
  totalMonths,
  averageSalePrice,
  previousAverageSalePrice,
}: GoalInsightsPanelProps) {
  const expectedProgress = (monthsPassed / totalMonths) * incomeGoal;
  const actualProgress = closedVolume;
  const isOnTrack = actualProgress >= expectedProgress * 0.9; // 90% threshold
  const projectedFinish = monthsPassed > 0 ? (actualProgress / monthsPassed) * totalMonths : 0;
  const monthsRemaining = totalMonths - monthsPassed;
  const neededPerMonth = monthsRemaining > 0 ? (incomeGoal - closedVolume - pipelineVolume) / monthsRemaining : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const priceTrend = previousAverageSalePrice
    ? ((averageSalePrice - previousAverageSalePrice) / previousAverageSalePrice) * 100
    : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-blue-950/20">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Goal Insights</h3>
      </div>

      <div className="space-y-4">
        {/* On Track Status */}
        <div className={`rounded-xl border-2 p-4 ${
          isOnTrack
            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
            : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
        }`}>
          <div className="flex items-center gap-3">
            {isOnTrack ? (
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <div>
              <div className={`font-semibold ${
                isOnTrack ? 'text-green-900 dark:text-green-300' : 'text-orange-900 dark:text-orange-300'
              }`}>
                {isOnTrack ? '✓ You are on track!' : '⚠ Behind pace'}
              </div>
              <div className={`text-sm ${
                isOnTrack ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
              }`}>
                {isOnTrack
                  ? `Great job! You're ${((actualProgress / expectedProgress) * 100).toFixed(0)}% of expected progress`
                  : `You're at ${((actualProgress / expectedProgress) * 100).toFixed(0)}% of expected progress`}
              </div>
            </div>
          </div>
        </div>

        {/* Projected Finish */}
        <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Projected Year-End</div>
              <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(projectedFinish)}</div>
            </div>
            <div className={`rounded-lg px-2 py-1 text-xs font-medium ${
              projectedFinish >= incomeGoal
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
            }`}>
              {projectedFinish >= incomeGoal ? 'Above Goal' : 'Below Goal'}
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Based on current pace ({monthsPassed} months)
          </div>
        </div>

        {/* Monthly Target */}
        <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Needed Per Month (Remaining)</div>
          <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(neededPerMonth)}</div>
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            To hit your goal over the next {monthsRemaining} months
          </div>
        </div>

        {/* Price Trend */}
        {previousAverageSalePrice && (
          <div className="rounded-xl bg-white p-4 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg Sale Price Trend</div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                priceTrend > 0
                  ? 'text-green-600 dark:text-green-400'
                  : priceTrend < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}>
                {priceTrend > 0 ? '↑' : priceTrend < 0 ? '↓' : '→'} {Math.abs(priceTrend).toFixed(1)}%
              </div>
            </div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {priceTrend > 0 ? 'Trending up' : priceTrend < 0 ? 'Trending down' : 'Stable'} from last period
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

