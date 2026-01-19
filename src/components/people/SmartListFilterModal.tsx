'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Tag } from '@/lib/definitions/backend/tag';
import { SetSmartListFilterCriteria } from '@/lib/data/backend/clientCalls';
import { SmartList } from '@/lib/definitions/backend/smartList';
import { useRouter } from 'next/navigation';

interface SmartListFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    smartList: SmartList;
    tags: Tag[];
}

type FilterRow = {
    field: string;
    value: string | string[];
};

const CONTACT_FIELDS = [
    { value: 'status', label: 'Status is' },
    { value: 'source', label: 'Source contains' },
    { value: 'city', label: 'City contains' },
    { value: 'state', label: 'State contains' },
    { value: 'zip_code', label: 'Zip code is' },
    { value: 'lender', label: 'Lender contains' },
    { value: 'price_range', label: 'Price range is' },
    { value: 'timeframe', label: 'Timeframe is' },
    { value: 'tag_ids', label: 'Includes all of these tags' },
    { value: 'last_contacted_days', label: 'Last contacted more than (days ago)' },
];

export default function SmartListFilterModal({
    isOpen,
    onClose,
    smartList,
    tags,
}: SmartListFilterModalProps) {
    const [filters, setFilters] = useState<FilterRow[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    /**
     * Load existing filter criteria into UI
     */
    useEffect(() => {
        if (!smartList.FilterCriteria?.Valid) {
            setFilters([]);
            return;
        }

        const criteria = smartList.FilterCriteria.RawMessage || {};
        const loaded: FilterRow[] = Object.entries(criteria).map(([field, value]) => ({
            field,
            value: Array.isArray(value) ? value : String(value),
        }));

        setFilters(loaded);
    }, [smartList]);

    const addFilter = () => {
        setFilters([...filters, { field: 'status', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const updateFilter = (index: number, key: keyof FilterRow, value: any) => {
        const updated = [...filters];
        updated[index] = { ...updated[index], [key]: value };
        setFilters(updated);
    };

    /**
     * Save exactly what backend expects:
     * {
     *   status: "Hot",
     *   tag_ids: ["uuid1", "uuid2"],
     *   last_contacted_days: 30
     * }
     */
    const handleSave = async () => {
        setIsSaving(true);

        try {
            const filterCriteria: Record<string, any> = {};

            filters.forEach(filter => {
                if (
                    filter.value === '' ||
                    (Array.isArray(filter.value) && filter.value.length === 0)
                ) return;

                filterCriteria[filter.field] = filter.value;
            });

            await SetSmartListFilterCriteria(smartList.ID, filterCriteria);
            toast.success('Smart list filters updated');
            router.refresh();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update smart list filters');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTag = (index: number, tagId: string) => {
        const current = filters[index].value as string[] || [];

        if (current.includes(tagId)) {
            updateFilter(index, 'value', current.filter(id => id !== tagId));
        } else {
            updateFilter(index, 'value', [...current, tagId]);
        }
    };

    const PRICE_RANGES = [
        { label: 'Under $250k', value: 'Under $250k' },
        { label: '$250k - $499k', value: '$250k - $499k' },
        { label: '$500k - $749k', value: '$500k - $749k' },
        { label: '$750k - $1M', value: '$750k - $1M' },
        { label: '+$1M', value: '+$1M' },
    ];

    const TIMEFRAMES = [
        { label: 'Immediate', value: 'Immediate' },
        { label: '1-3 months', value: '1-3 months' },
        { label: '4-6 months', value: '4-6 months' },
        { label: '7-12 months', value: '7-12 months' },
        { label: '12+ months', value: '12+ months' },
    ];

    const tagFilter = filters.find((f: FilterRow) => f.field === 'tag_ids');
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Filters: {smartList.Name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Selected tags display at the top */}
                    {tagFilter?.value && (tagFilter.value as string[]).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(tagFilter.value as string[]).map(tagId => {
                                const tag = tags.find(t => t.ID === tagId);
                                if (!tag) return null;

                                return (
                                    <span
                                        key={tagId}
                                        className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium"
                                    >
                                        {tag.Name}
                                        <button
                                            type="button"
                                            className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
                                            onClick={() => toggleTag(filters.findIndex((f: FilterRow) => f.field === 'tag_ids'), tagId)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Filter rows */}
                    {filters.map((filter, index) => (
                        <div key={index} className="flex items-end gap-3">
                            {/* Field column */}
                            <div className="w-72 space-y-2">
                                <Label>Filter</Label>
                                <Select
                                    value={filter.field}
                                    onValueChange={(value) => updateFilter(index, 'field', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONTACT_FIELDS.map(field => (
                                            <SelectItem key={field.value} value={field.value}>
                                                {field.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Value column */}
                            <div className="flex-1 space-y-2">
                                <Label>Value</Label>

                                {/* Show tag select only if this filter is tag_ids */}
                                {filter.field === 'tag_ids' && (
                                    <Select onValueChange={(tagId) => toggleTag(index, tagId)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tags.map(tag => (
                                                <SelectItem key={tag.ID} value={tag.ID}>
                                                    {tag.Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {/* Other field types here (last_contacted_days, price_range, timeframe, default text) */}
                                {filter.field === 'last_contacted_days' && (
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="e.g. 30"
                                        value={String(filter.value || '')}
                                        onChange={(e) => updateFilter(index, 'value', Number(e.target.value))}
                                    />
                                )}

                                {filter.field === 'price_range' && (
                                    <Select
                                        value={String(filter.value || '')}
                                        onValueChange={(value) => updateFilter(index, 'value', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select price range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRICE_RANGES.map(range => (
                                                <SelectItem key={range.value} value={range.value}>
                                                    {range.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {filter.field === 'timeframe' && (
                                    <Select
                                        value={String(filter.value || '')}
                                        onValueChange={(value) => updateFilter(index, 'value', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timeframe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIMEFRAMES.map(frame => (
                                                <SelectItem key={frame.value} value={frame.value}>
                                                    {frame.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {filter.field !== 'tag_ids' &&
                                    filter.field !== 'last_contacted_days' &&
                                    filter.field !== 'price_range' &&
                                    filter.field !== 'timeframe' && (
                                        <Input
                                            placeholder="Enter value"
                                            value={String(filter.value || '')}
                                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                        />
                                    )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFilter(index)}
                            >
                                ✕
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" onClick={addFilter} className="w-full">
                        + Add Filter
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Filters'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
