'use client';

import { useMemo, useState, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddStageModal } from "@/components/deals/addStageModal";
import { Stage } from "@/lib/definitions/backend/stage";
import { Deal } from "@/lib/definitions/backend/deals";
import DealCard from "@/components/deals/DealCard";
import StageColumn from "@/components/deals/StageColumn";
import CreateDealModal from "@/components/deals/CreateDealSheet";
import { UpdateDeal } from "@/lib/data/backend/clientCalls";
import { useRouter } from "next/navigation";

interface DealsPageClientProps {
    deals: Deal[];
    clientType: "buyer" | "seller";
    stages: Stage[];
}

export default function DealsPipelinePage({ deals, clientType, stages }: DealsPageClientProps) {
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [localDeals, setLocalDeals] = useState<Deal[]>(deals);
    const router = useRouter();

    // Sync local deals with props when they change
    useEffect(() => {
        setLocalDeals(deals);
    }, [deals]);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group deals by stage using local deals
    const dealsByStage = useMemo(() => {
        const grouped: { [stageId: string]: Deal[] } = {};
        stages.forEach(stage => {
            grouped[stage.ID] = [];
        });

        localDeals.forEach(deal => {
            if (deal.StageID && grouped[deal.StageID]) {
                grouped[deal.StageID].push(deal);
            }
        });

        return grouped;
    }, [localDeals, stages]);

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        const deal = localDeals.find(d => d.ID === event.active.id);
        setActiveDeal(deal || null);
    };

    // Handle drag end with optimistic update
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDeal(null);

        if (!over) return;

        const dealId = active.id as string;
        const newStageId = over.id as string;

        // Find the deal being moved
        const deal = localDeals.find(d => d.ID === dealId);
        if (!deal) return;

        // If dropped on same stage, do nothing
        if (deal.StageID === newStageId) return;

        // Optimistically update the UI immediately
        setLocalDeals(prev =>
            prev.map(d =>
                d.ID === dealId
                    ? { ...d, StageID: newStageId }
                    : d
            )
        );

        // Update backend in the background
        try {
            await UpdateDeal(
                dealId,
                deal.ContactID,
                deal.Title,
                deal.Price,
                deal.ClosingDate.Valid ? deal.ClosingDate.Time : '',
                deal.EarnestMoneyDueDate.Valid ? deal.EarnestMoneyDueDate.Time : '',
                deal.MutualAcceptanceDate.Valid ? deal.MutualAcceptanceDate.Time : '',
                deal.InspectionDate.Valid ? deal.InspectionDate.Time : '',
                deal.AppraisalDate.Valid ? deal.AppraisalDate.Time : '',
                deal.FinalWalkthroughDate.Valid ? deal.FinalWalkthroughDate.Time : '',
                deal.PossessionDate.Valid ? deal.PossessionDate.Time : '',
                deal.ClosedDate.Valid ? deal.ClosedDate.Time : '',
                deal.Commission.Valid ? Number(deal.Commission.String) : 0,
                deal.CommissionSplit.Valid ? Number(deal.CommissionSplit.String) : 0,
                deal.PropertyAddress.Valid ? deal.PropertyAddress.String : '',
                deal.PropertyCity.Valid ? deal.PropertyCity.String : '',
                deal.PropertyState.Valid ? deal.PropertyState.String : '',
                deal.PropertyZipCode.Valid ? deal.PropertyZipCode.String : '',
                deal.Description.Valid ? deal.Description.String : '',
                newStageId
            );

            // Refresh to sync with server state (but UI already updated)
            router.refresh();
        } catch (error) {
            console.error('Failed to update deal:', error);
            // On error, revert to original deals
            setLocalDeals(deals);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

    const totalDeals = localDeals.length;
    const totalValue = localDeals.reduce((sum, deal) => sum + deal.Price, 0);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Deals Pipeline</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Drag and drop deals to move them between stages
                        </p>
                    </div>
                    <CreateDealModal stages={stages} variant="button" />
                </div>

                {/* Stats */}
                <div className="mb-6 flex gap-6 text-sm">
                    <div className="text-zinc-600 dark:text-zinc-400">
                        Total Deals: <span className="font-semibold text-zinc-900 dark:text-zinc-50">{totalDeals}</span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                        Total Value: <span className="font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalValue)}</span>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={clientType} onValueChange={(v) => router.push('/deals?client-type=' + v)}>
                    <TabsList className="grid w-48 grid-cols-2 mb-6">
                        <TabsTrigger value="buyer">Buyer</TabsTrigger>
                        <TabsTrigger value="seller">Seller</TabsTrigger>
                    </TabsList>

                    <TabsContent value={clientType}>
                        {/* Pipeline Columns */}
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {stages.map(stage => {
                                const stageDeals = dealsByStage[stage.ID] ?? [];

                                return (
                                    <StageColumn
                                        key={stage.ID}
                                        stage={stage}
                                        deals={stageDeals}
                                        stages={stages}
                                    />
                                );
                            })}

                            {/* Add Stage Column */}
                            <div className="flex-shrink-0 min-w-[300px] min-h-[50vh] flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                                <AddStageModal />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeDeal ? <DealCard deal={activeDeal} stages={stages} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
