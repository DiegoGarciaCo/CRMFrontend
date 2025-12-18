'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tag } from '@/lib/definitions/backend/tag';
import { SetSmartListFilterCriteria } from '@/lib/data/backend/clientCalls';


interface SmartListFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    smartListId: string;
    smartListName: string;
    currentFilter?: any;
    tags: Tag[];
}

const CONTACT_FIELDS = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'birthdate', label: 'Birthdate' },
    { value: 'source', label: 'Source' },
    { value: 'status', label: 'Status' },
    { value: 'address', label: 'Address' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
    { value: 'zip_code', label: 'Zip Code' },
    { value: 'lender', label: 'Lender' },
    { value: 'price_range', label: 'Price Range' },
    { value: 'timeframe', label: 'Timeframe' },
    { value: 'tag_id', label: 'Tag' },
    { value: 'last_contacted_days', label: 'Last Contacted Days Ago' },
];

export default function SmartListFilterModal({
    isOpen,
    onClose,
    smartListId,
    smartListName,
    tags,
}: SmartListFilterModalProps) {
    const [filters, setFilters] = useState<Array<{ field: string; operator: string; value: string }>>([
        { field: 'status', operator: 'equals', value: '' },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const addFilter = () => {
        setFilters([...filters, { field: 'status', operator: 'equals', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const updateFilter = (index: number, key: string, value: string) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [key]: value };
        setFilters(newFilters);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const filterCriteria: any = {};

            filters.forEach(filter => {
                if (!filter.value) return;

                if (filter.operator === 'equals') {
                    filterCriteria[filter.field] = filter.value;
                } else if (filter.operator === 'in') {
                    filterCriteria[filter.field] = filter.value.split(',').map(v => v.trim());
                }
            });

            await SetSmartListFilterCriteria(smartListId, filterCriteria);
            toast.success('Filter criteria updated successfully');
            onClose();
        } catch (error) {
            console.error('Failed to update filter:', error);
            toast.error('Failed to update filter criteria');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Filter: {smartListName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {filters.map((filter, index) => (
                        <div key={index} className="flex items-end gap-2">
                            {/* Field selector */}
                            <div className="flex-1 space-y-2">
                                <Label>Field</Label>
                                <Select
                                    value={filter.field}
                                    onValueChange={(value) => updateFilter(index, 'field', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONTACT_FIELDS.map((field) => (
                                            <SelectItem key={field.value} value={field.value}>
                                                {field.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Operator */}
                            <div className="w-32 space-y-2">
                                <Label>Operator</Label>
                                <Select
                                    value={filter.operator}
                                    onValueChange={(value) => updateFilter(index, 'operator', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equals">Equals</SelectItem>
                                        <SelectItem value="in">In List</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Value */}
                            <div className="flex-1 space-y-2">
                                <Label>Value</Label>

                                {/* Status dropdown */}
                                {filter.field === 'status' && (
                                    <Input
                                        type="text"
                                        placeholder="Enter status"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                    />
                                )}

                                {/* Source dropdown */}
                                {filter.field === 'source' && (
                                    <Input
                                        placeholder="Enter source"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                    />
                                )}

                                {/* Tag dropdown */}
                                {filter.field === 'tag_id' && (
                                    <Select
                                        value={filter.value}
                                        onValueChange={(v) => updateFilter(index, 'value', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select tag" /></SelectTrigger>
                                        <SelectContent>
                                            {tags.map(tag => (
                                                <SelectItem key={tag.ID} value={tag.ID}>{tag.Name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {/* Birthdate */}
                                {filter.field === 'birthdate' && (
                                    <Input
                                        type="date"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                    />
                                )}

                                {/* Last contacted days ago */}
                                {filter.field === 'last_contacted_days' && (
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="Days ago"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                    />
                                )}

                                {/* Default text input */}
                                {[
                                    'first_name', 'last_name', 'address', 'city', 'state',
                                    'zip_code', 'lender', 'price_range', 'timeframe'
                                ].includes(filter.field) && (
                                        <Input
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                            placeholder="Enter value"
                                        />
                                    )}
                            </div>

                            <Button variant="ghost" size="icon" onClick={() => removeFilter(index)}>
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
