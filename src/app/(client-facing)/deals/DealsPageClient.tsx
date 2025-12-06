'use client';

import { useEffect, useMemo, useState } from "react";
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
import CreateDealSheet from "@/components/deals/CreateDealSheet";
import { GetStagesByClientType, UpdateDeal } from "@/lib/data/backend/clientCalls";

interface DealsPageClientProps {
    deals: Deal[];
    userId: string;
}

export default function DealsPipelinePage({ deals: initialDeals, userId }: DealsPageClientProps) {
    const [clientType, setClientType] = useState<"buyer" | "seller">("buyer");
    const [stages, setStages] = useState<Stage[]>([]);
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    console.log("deals", deals);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        })
    );

    // Fetch stages when tab changes
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const newStages = await GetStagesByClientType(clientType);
                setStages(newStages ?? []);
            } catch (err) {
                console.error("Failed to load stages", err);
            }
        };

        fetchStages();
    }, [clientType, userId]);

    // Group deals by stage
    const dealsByStage = useMemo(() => {
        const grouped: { [stageId: string]: Deal[] } = {};
        stages.forEach(stage => {
            grouped[stage.ID] = [];
        });

        deals.forEach(deal => {
            if (deal.StageID && grouped[deal.StageID]) {
                grouped[deal.StageID].push(deal);
            }
        });

        console.log("dealsByStage", grouped);
        return grouped;
    }, [deals, stages]);

    console.log("dealsByStage", dealsByStage);
    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        const deal = deals.find(d => d.ID === event.active.id);
        setActiveDeal(deal || null);
    };

    // Handle drag end
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDeal(null);

        if (!over) return;

        const dealId = active.id as string;
        const newStageId = over.id as string;

        // Find the deal being moved
        const deal = deals.find(d => d.ID === dealId);
        if (!deal) return;

        // If dropped on same stage, do nothing
        if (deal.StageID === newStageId) return;

        // Optimistically update UI
        setDeals(prevDeals =>
            prevDeals.map(d =>
                d.ID === dealId
                    ? { ...d, StageID: newStageId }
                    : d
            )
        );

        // Update backend
        setIsUpdating(true);
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
                deal.Commission.Valid ? deal.Commission.Int32 : 0,
                deal.CommissionSplit.Valid ? deal.CommissionSplit.Int32 : 0,
                deal.PropertyAddress.Valid ? deal.PropertyAddress.String : '',
                deal.PropertyCity.Valid ? deal.PropertyCity.String : '',
                deal.PropertyState.Valid ? deal.PropertyState.String : '',
                deal.PropertyZipCode.Valid ? deal.PropertyZipCode.String : '',
                deal.Description.Valid ? deal.Description.String : '',
                newStageId
            );
        } catch (error) {
            console.error('Failed to update deal:', error);
            // Revert on error
            setDeals(prevDeals =>
                prevDeals.map(d =>
                    d.ID === dealId ? deal : d
                )
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);


    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.Price, 0);

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
                    <CreateDealSheet userId={userId} stages={stages} />
                </div>

                {/* Stats */}
                <div className="mb-6 flex gap-6 text-sm">
                    <div className="text-zinc-600 dark:text-zinc-400">
                        Total Deals: <span className="font-semibold text-zinc-900 dark:text-zinc-50">{totalDeals}</span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                        Total Value: <span className="font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalValue)}</span>
                    </div>
                    {isUpdating && (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Updating...</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <Tabs value={clientType} onValueChange={(v) => setClientType(v as "buyer" | "seller")}>
                    <TabsList className="grid w-48 grid-cols-2 mb-6">
                        <TabsTrigger value="buyer">Buyer</TabsTrigger>
                        <TabsTrigger value="seller">Seller</TabsTrigger>
                    </TabsList>

                    <TabsContent value={clientType}>
                        {/* Pipeline Columns */}
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {stages.map(stage => {
                                const stageDeals = dealsByStage[stage.ID] ?? [];
                                console.log(`Stage ${stage.Name} has deals:`, stageDeals);

                                return (
                                    <StageColumn
                                        key={stage.ID}
                                        stage={stage}
                                        deals={stageDeals}
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
                {activeDeal ? <DealCard deal={activeDeal} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
