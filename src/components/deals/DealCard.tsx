'use client';

import { Deal } from '@/lib/definitions/backend/deals';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditDealModal } from './EditDealModal';
import { Stage } from '@/lib/definitions/backend/stage';

interface DealCardProps {
    deal: Deal;
    stages: Stage[];
}

export default function DealCard({ deal, stages }: DealCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: deal.ID });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const commissionAmount = deal.Commission?.Valid ? deal.CommissionSplit.Valid ? (Number(deal.Commission.String) / 100) * (Number(deal.CommissionSplit.String) / 100) * deal.Price : (Number(deal.Commission.String) / 100) * deal.Price : 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-800/50"
        >
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {deal.Title}
                </h4>

                <EditDealModal
                    deal={deal}
                    stages={stages.map((s) => ({ id: s.ID, name: s.Name }))}
                />
            </div>

            <p className="mt-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(deal.Price)}
            </p>

            {deal.PropertyAddress?.Valid && (
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {deal.PropertyAddress.String}
                    {deal.PropertyCity?.Valid && `, ${deal.PropertyCity.String}`}
                    {deal.PropertyState?.Valid && `, ${deal.PropertyState.String}`}
                </p>
            )}

            {deal.ClosingDate?.Valid && (
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    Close: {formatDate(deal.ClosingDate.Time)}
                </p>
            )}

            {deal.Commission?.Valid && Number(deal.Commission.String) > 0 && (
                <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                    Commission:{" "}
                    {formatCurrency(commissionAmount)}
                </p>
            )}
        </div>
    );
}
