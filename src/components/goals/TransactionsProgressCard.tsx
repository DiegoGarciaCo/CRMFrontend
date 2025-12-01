'use client';

interface TransactionsProgressCardProps {
  transactionGoal: number;
  closedTransactions: number;
  pipelineTransactions: number;
  averageSalePrice: number;
  averageCommission: number;
}

export default function TransactionsProgressCard({
  transactionGoal,
  closedTransactions,
  pipelineTransactions,
  averageSalePrice,
  averageCommission,
}: TransactionsProgressCardProps) {
  const totalTransactions = closedTransactions + pipelineTransactions;
  const progressPercentage = (totalTransactions / transactionGoal) * 100;
  const remaining = Math.max(0, transactionGoal - totalTransactions);
  const estimatedRevenue = remaining * averageSalePrice * (averageCommission / 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Transactions to Goal</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {remaining} more deals needed
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Target</div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{transactionGoal}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            {totalTransactions} / {transactionGoal} transactions
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 dark:from-purple-600 dark:to-purple-700"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">Closed</div>
          <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{closedTransactions}</div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">Pipeline</div>
          <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{pipelineTransactions}</div>
        </div>
        <div className="col-span-2 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/10">
          <div className="text-xs text-purple-600 dark:text-purple-400">Est. Revenue Needed</div>
          <div className="mt-1 text-lg font-bold text-purple-900 dark:text-purple-300">{formatCurrency(estimatedRevenue)}</div>
        </div>
      </div>
    </div>
  );
}

