'use client';

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddStageModal } from "@/components/deals/addStageModal";
import { GetStagesByClientType } from "@/lib/data/backend/stages";
import { Stage } from "@/lib/definitions/backend/stage";
import { Deal } from "@/lib/definitions/backend/deals";

interface DealsPageClientProps { deals: Deal[]; stages: Stage[]; userId: string; }

export default function DealsPipelinePage({ deals, userId }: DealsPageClientProps) {
    const [clientType, setClientType] = useState<"buyer" | "seller">("buyer");
    const [stages, setStages] = useState<any[]>([]);

    // Fetch stages when tab changes
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const newStages = await GetStagesByClientType(clientType, userId);

                const normalized = (newStages ?? []).map((s: any) => ({
                    ID: s.ID ?? s.id,
                    Name: s.Name ?? s.name,
                    Description: s.Description ?? { Valid: false, String: "" },
                    orderIndex: s.orderIndex ?? s.order_index ?? 0,
                }));

                setStages(normalized);
            } catch (err) {
                console.error("Failed to load stages", err);
            }
        };

        fetchStages();
    }, [clientType, userId]);

    // Group deals by stage
    const dealsByStage = useMemo(() => {
        const grouped: { [stageId: string]: any[] } = {};
        stages.forEach(stage => {
            grouped[stage.ID] = [];
        });

        deals.forEach(deal => {
            if (deal.StageID?.Valid && grouped[deal.StageID.UUID]) {
                grouped[deal.StageID.UUID].push(deal);
            }
        });

        return grouped;
    }, [deals, stages]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const getStageTotal = (stageId: string) =>
        (dealsByStage[stageId] ?? []).reduce((sum, deal) => sum + deal.Price, 0);

    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.Price, 0);

    return (
        <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Deals Pipeline</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track your deals through each stage</p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    + New Deal
                </button>
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
                            const stageTotal = getStageTotal(stage.ID);

                            return (
                                <div
                                    key={stage.ID}
                                    className="flex-shrink-0 w-80 min-h-[50vh] flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                                >
                                    {/* Stage Header */}
                                    <div className="mb-4 border-b border-zinc-200 pb-2 dark:border-zinc-800">
                                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{stage.Name}</h2>
                                        {stage.Description.Valid && stage.Description.String && (
                                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{stage.Description.String}</p>
                                        )}
                                        <div className="mt-2 flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                            <span>{stageDeals.length} Deals</span>
                                            <span>{formatCurrency(stageTotal)}</span>
                                        </div>
                                    </div>

                                    {/* Deals List */}
                                    <div className="flex-1 space-y-3 overflow-y-auto">
                                        {stageDeals.length === 0 ? (
                                            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">No deals yet</p>
                                            </div>
                                        ) : (
                                            stageDeals.map(deal => (
                                                <div
                                                    key={deal.ID}
                                                    className="cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/50"
                                                >
                                                    <h4 className="font-medium text-zinc-900 dark:text-zinc-50">{deal.Title}</h4>
                                                    <p className="text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(deal.Price)}</p>
                                                    {deal.PropertyAddress?.Valid && (
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                                            {deal.PropertyAddress.String}
                                                            {deal.PropertyCity?.Valid && `, ${deal.PropertyCity.String}`}
                                                            {deal.PropertyState?.Valid && `, ${deal.PropertyState.String}`}
                                                        </p>
                                                    )}
                                                    {deal.ClosingDate?.Valid && (
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Close: {formatDate(deal.ClosingDate.Time)}</p>
                                                    )}
                                                    {deal.Commission?.Valid && deal.Commission.Int32 > 0 && (
                                                        <p className="text-xs text-green-600 dark:text-green-400">Commission: {formatCurrency(deal.Commission.Int32)}</p>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Stage Column */}
                        <div className="flex-shrink-0 min-w-[300px] min-h-[50vh] flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                            <AddStageModal userId={userId} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
