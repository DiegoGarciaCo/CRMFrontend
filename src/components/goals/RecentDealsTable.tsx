'use client';

import { Deal } from '@/lib/definitions/backend/deals';

interface RecentDealsTableProps {
  deals: Deal[];
}

export default function RecentDealsTable({ deals }: RecentDealsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (stageId: string) => {
    // This is a simplified version - you'd want to look up the actual stage name
    // For now, we'll use a placeholder logic
    return stageId ? (
      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Closed
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        Under Contract
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Deals</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Closed and pipeline deals</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Volume
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Commission
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
                  No deals found
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal.ID} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{deal.Title}</div>
                    {deal.PropertyAddress.Valid && deal.PropertyAddress.String && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {deal.PropertyAddress.String}
                        {deal.PropertyCity.Valid && `, ${deal.PropertyCity.String}`}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {deal.StageID && getStatusBadge(deal.StageID)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(deal.Price)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {deal.Commission.Valid && deal.Commission.Int32 > 0 ? (
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(deal.Commission.Int32)}
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500 dark:text-zinc-500">—</div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

