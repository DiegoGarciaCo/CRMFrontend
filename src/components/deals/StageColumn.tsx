'use client';

import { Deal } from '@/lib/definitions/backend/deals';
import { Stage } from '@/lib/definitions/backend/stage';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DealCard from './DealCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { EditStageModal } from './EditStageModal';

interface StageColumnProps {
    stage: Stage;
    deals: Deal[];
    stages: Stage[];
}

export default function StageColumn({ stage, deals, stages }: StageColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.ID,
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

    const stageTotal = deals.reduce((sum, deal) => sum + deal.Price, 0);

    return (
        <div
            className={`flex min-h-[50vh] w-80 flex-shrink-0 flex-col rounded-2xl border-2 transition-all ${isOver
                ? 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/20'
                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                } p-4 shadow-lg`}
        >
            {/* Stage Header */}
            <div className="mb-4 border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{stage.Name}</h2>
                    <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {deals.length}
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <div>
                        {formatCurrency(stageTotal)}
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Edit button */}
                        <EditStageModal
                            stageID={stage.ID}
                            name={stage.Name}
                            description={stage.Description.Valid ? stage.Description.String : ''}
                            client_type={stage.ClientType}
                            order_index={stage.OrderIndex}
                            hasDeals={deals.length > 0}
                        />

                        {/* Tooltip */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-6 w-6 rounded-full dark:bg-zinc-700 flex items-center justify-center text-xs font-medium cursor-pointer border border-blue-300">
                                        i
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {stage.Description.Valid ? stage.Description.String : 'No description provided.'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Deals List */}
            <div
                ref={setNodeRef}
                className="flex-1 space-y-3 overflow-y-auto"
            >
                <SortableContext items={deals.map(d => d.ID)} strategy={verticalListSortingStrategy}>
                    {deals.length === 0 ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                            <p className="text-sm text-zinc-500 dark:text-zinc-500">Drop deals here</p>
                        </div>
                    ) : (
                        deals.map(deal => <DealCard key={deal.ID} deal={deal} stages={stages} />)
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

