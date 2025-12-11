'use client';

import { Goal } from '@/lib/definitions/backend/goals';
import { Deal } from '@/lib/definitions/backend/deals';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GoalProgressCard from '@/components/goals/GoalProgressCard';
import TransactionsProgressCard from '@/components/goals/TransactionsProgressCard';
import GoalInsightsPanel from '@/components/goals/GoalInsightsPanel';
import RecentDealsTable from '@/components/goals/RecentDealsTable';
import { CreateGoal } from '@/lib/data/backend/clientCalls';

interface GoalsPageClientProps {
    goal: Goal | undefined;
    deals: Deal[];
    selectedYear: number;
    currentYear: number;
}

export default function GoalsPageClient({
    goal,
    deals,
    selectedYear,
    currentYear
}: GoalsPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentGoal = goal?.ID ? goal : null;
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        year: selectedYear,
        month: 1,
        income_goal: "",
        transaction_goal: "",
        estimated_average_sale_price: "",
        estimated_average_commission_rate: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await CreateGoal(
            form.year,
            form.month,
            form.income_goal,
            form.transaction_goal,
            form.estimated_average_sale_price,
            form.estimated_average_commission_rate
        );
        location.reload();
    }

    // Navigation functions
    const navigateToYear = (year: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('year', year.toString());
        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : '');
    };

    const goToPreviousYear = () => {
        navigateToYear(selectedYear - 1);
    };

    const goToNextYear = () => {
        navigateToYear(selectedYear + 1);
    };

    // Determine if we can navigate to next year (up to current year + 5)
    const canGoNext = selectedYear < currentYear + 5;
    const canGoPrevious = selectedYear > 2024;

    // Calculate metrics from deals
    const metrics = useMemo(() => {
        const closedDeals = deals.filter(deal => deal.ClosedDate.Valid);
        const pipelineDeals = deals.filter(deal => !deal.ClosedDate.Valid);

        const closedVolume = closedDeals.reduce((sum, deal) => sum + deal.Price, 0);
        const pipelineVolume = pipelineDeals.reduce((sum, deal) => sum + deal.Price, 0);

        const closedCommissionPaid = closedDeals.reduce((sum, deal) =>
            sum + (deal.Commission.Valid ? (deal.Commission.Int32 / 100) * deal.Price : 0), 0
        );
        const pipelineCommissionPending = pipelineDeals.reduce((sum, deal) =>
            sum + (deal.Commission.Valid ? (deal.Commission.Int32 / 100) * deal.Price : 0), 0
        );

        const totalCommission = closedDeals.reduce((sum, deal) =>
            sum + (deal.Commission.Valid ? (deal.Commission.Int32 / 100) * deal.Price : 0), 0
        );

        const closedTransactions = closedDeals.length;
        const pipelineTransactions = pipelineDeals.length;

        const averageSalePrice = closedDeals.length > 0
            ? closedVolume / closedDeals.length
            : currentGoal?.EstimatedAverageSalePrice?.Valid
                ? parseFloat(currentGoal.EstimatedAverageSalePrice.String.replace(/[^0-9.-]+/g, ''))
                : 0;

        const averageCommission = closedDeals.length > 0
            ? (totalCommission / closedVolume) * 100
            : currentGoal?.EstimatedAverageCommissionRate?.Valid
                ? parseFloat(currentGoal.EstimatedAverageCommissionRate.String.replace(/[^0-9.-]+/g, ''))
                : 3;

        return {
            closedVolume,
            pipelineVolume,
            closedCommissionPaid,
            pipelineCommissionPending,
            totalCommission,
            closedTransactions,
            pipelineTransactions,
            averageSalePrice,
            averageCommission,
            closedDeals,
            pipelineDeals,
        };
    }, [deals, currentGoal]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const totalMonths = 12;

    const incomeGoal = currentGoal?.IncomeGoal?.Valid
        ? parseFloat(currentGoal.IncomeGoal.String.replace(/[^0-9.-]+/g, ''))
        : 0;

    const transactionGoal = currentGoal?.TransactionGoal?.Valid
        ? currentGoal.TransactionGoal.Int32
        : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const recentDeals = useMemo(() => {
        return [...deals]
            .sort((a, b) => {
                const dateA = a.CreatedAt.Valid ? new Date(a.CreatedAt.Time).getTime() : 0;
                const dateB = b.CreatedAt.Valid ? new Date(b.CreatedAt.Time).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 10);
    }, [deals]);

    // Year indicator badge
    const YearBadge = () => (
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${selectedYear === currentYear
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}>
            {selectedYear === currentYear ? 'Current Year' : selectedYear}
        </div>
    );

    if (!currentGoal && !showForm) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Year Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={goToPreviousYear}
                        disabled={!canGoPrevious}
                        className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800"
                        aria-label="Previous year"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <YearBadge />

                    <button
                        onClick={goToNextYear}
                        disabled={!canGoNext}
                        className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800"
                        aria-label="Next year"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <svg className="mx-auto h-16 w-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697..." />
                    </svg>

                    <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        No Goals Set for {selectedYear}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Set your annual production goal to start tracking your progress
                    </p>

                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Set Goal
                    </button>
                </div>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                        Set Your Goal for {selectedYear}
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <input
                                type="number"
                                name="month"
                                value={form.month}
                                onChange={handleChange}
                                min={1}
                                max={12}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Income Goal ($)</label>
                            <input
                                type="text"
                                name="income_goal"
                                value={form.income_goal}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Transaction Goal (#)</label>
                            <input
                                type="number"
                                name="transaction_goal"
                                value={form.transaction_goal}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Estimated Average Sale Price ($)</label>
                            <input
                                type="text"
                                name="estimated_average_sale_price"
                                value={form.estimated_average_sale_price}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Estimated Commission Rate (%)</label>
                            <input
                                type="text"
                                name="estimated_average_commission_rate"
                                value={form.estimated_average_commission_rate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Save Goal
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Year Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={goToPreviousYear}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800"
                    aria-label="Previous year"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">{selectedYear - 1}</span>
                </button>

                <YearBadge />

                <button
                    onClick={goToNextYear}
                    disabled={!canGoNext}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800"
                    aria-label="Next year"
                >
                    <span className="hidden sm:inline">{selectedYear + 1}</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Production Goals</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Track your progress and stay on target for {selectedYear}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Progress Card */}
            <div className="mb-6">
                <GoalProgressCard
                    incomeGoal={incomeGoal}
                    closedVolume={metrics.closedCommissionPaid}
                    pipelineVolume={metrics.pipelineCommissionPending}
                />
            </div>

            {/* Two Column Layout */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <TransactionsProgressCard
                    transactionGoal={transactionGoal}
                    closedTransactions={metrics.closedTransactions}
                    pipelineTransactions={metrics.pipelineTransactions}
                    averageSalePrice={metrics.averageSalePrice}
                    averageCommission={metrics.averageCommission}
                />

                <GoalInsightsPanel
                    incomeGoal={incomeGoal}
                    closedVolume={metrics.closedCommissionPaid}
                    pipelineVolume={metrics.pipelineCommissionPending}
                    monthsPassed={currentMonth}
                    totalMonths={totalMonths}
                    averageSalePrice={metrics.averageSalePrice}
                />
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Closed</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.closedVolume)}</p>
                        </div>
                        <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                            <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Volume Under Contract</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.pipelineVolume)}</p>
                        </div>
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg Sale Price</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.averageSalePrice)}</p>
                        </div>
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Commission</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.totalCommission)}</p>
                        </div>
                        <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                            <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Houses Closed</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{metrics.closedTransactions}</p>
                        </div>
                        <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">In Pipeline</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{metrics.pipelineTransactions}</p>
                        </div>
                        <div className="rounded-lg bg-cyan-100 p-3 dark:bg-cyan-900/30">
                            <svg className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Projected Total Volume</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {formatCurrency(metrics.closedVolume + metrics.pipelineVolume)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/30">
                            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg Commission</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{metrics.averageCommission.toFixed(2)}%</p>
                        </div>
                        <div className="rounded-lg bg-rose-100 p-3 dark:bg-rose-900/30">
                            <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Deals Table */}
            <RecentDealsTable deals={recentDeals} />
        </div>
    );
}
