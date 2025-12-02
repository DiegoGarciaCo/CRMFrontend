'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SetSmartListFilterCriteria } from '@/lib/data/backend/smartLists';
import { toast } from 'sonner';

interface SmartListFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  smartListId: string;
  smartListName: string;
  currentFilter?: any;
  onFilterUpdate: () => void;
}

const CONTACT_FIELDS = [
  { value: 'status', label: 'Status' },
  { value: 'source', label: 'Source' },
  { value: 'priceRange', label: 'Price Range' },
  { value: 'timeframe', label: 'Timeframe' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'lender', label: 'Lender' },
];

const STATUS_OPTIONS = ['New', 'Active', 'Qualified', 'Negotiating', 'Closed', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Phone Call', 'Other'];

export default function SmartListFilterModal({
  isOpen,
  onClose,
  smartListId,
  smartListName,
  currentFilter,
  onFilterUpdate,
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
      // Build filter criteria object
      const filterCriteria: any = {};
      
      filters.forEach(filter => {
        if (filter.value) {
          if (filter.operator === 'equals') {
            filterCriteria[filter.field] = filter.value;
          } else if (filter.operator === 'in') {
            filterCriteria[filter.field] = filter.value.split(',').map(v => v.trim());
          }
        }
      });

      await SetSmartListFilterCriteria(smartListId, filterCriteria);
      toast.success('Filter criteria updated successfully');
      onFilterUpdate();
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Add filters to show only contacts that match your criteria
          </p>

          {filters.map((filter, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`field-${index}`}>Field</Label>
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(index, 'field', value)}
                >
                  <SelectTrigger id={`field-${index}`}>
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

              <div className="w-32 space-y-2">
                <Label htmlFor={`operator-${index}`}>Operator</Label>
                <Select
                  value={filter.operator}
                  onValueChange={(value) => updateFilter(index, 'operator', value)}
                >
                  <SelectTrigger id={`operator-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="in">In List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor={`value-${index}`}>Value</Label>
                {filter.field === 'status' ? (
                  <Select
                    value={filter.value}
                    onValueChange={(value) => updateFilter(index, 'value', value)}
                  >
                    <SelectTrigger id={`value-${index}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : filter.field === 'source' ? (
                  <Select
                    value={filter.value}
                    onValueChange={(value) => updateFilter(index, 'value', value)}
                  >
                    <SelectTrigger id={`value-${index}`}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_OPTIONS.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`value-${index}`}
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    placeholder={filter.operator === 'in' ? 'Value1, Value2, ...' : 'Enter value'}
                  />
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(index)}
                disabled={filters.length === 1}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addFilter} className="w-full">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Filter
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Filters'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

