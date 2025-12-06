'use client';

import { Deal } from '@/lib/definitions/backend/deals';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DealCardProps {
    deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
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
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-800/50"
        >
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{deal.Title}</h4>
            <p className="mt-2 text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(deal.Price)}</p>

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

            {deal.Commission?.Valid && deal.Commission.Int32 > 0 && (
                <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                    Commission: {formatCurrency((deal.Commission.Int32 / 100) * deal.Price)}
                </p>
            )}
        </div>
    );
}

