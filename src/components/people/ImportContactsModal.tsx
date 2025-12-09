'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Papa from 'papaparse';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ImportContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
}

interface CSVColumn {
    index: number;
    name: string;
    preview: string[];
}

const CONTACT_FIELDS = [
    { value: 'ignore', label: 'Ignore Column' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'address', label: 'Address' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
    { value: 'zip_code', label: 'Zip Code' },
    { value: 'birthdate', label: 'Birthdate' },
    { value: 'source', label: 'Source' },
    { value: 'status', label: 'Status' },
    { value: 'price_range', label: 'Price Range' },
    { value: 'timeframe', label: 'Timeframe' },
    { value: 'lender', label: 'Lender' },
    { value: 'tags', label: 'Tags' },
];

export default function ImportContactsModal({ isOpen, onClose, onSuccess, userId }: ImportContactsModalProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'importing'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [columns, setColumns] = useState<CSVColumn[]>([]);
    const [columnMappings, setColumnMappings] = useState<Record<number, string>>({});
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.csv')) {
            toast.error('Please upload a CSV file');
            return;
        }

        setFile(selectedFile);
        parseCSV(selectedFile);
    };

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as string[][];

                if (rows.length < 2) {
                    toast.error('CSV file must have at least a header row and one data row');
                    return;
                }

                setCsvData(rows);

                const headers = rows[0];
                const previewRows = rows.slice(1, 4); // first 3 data rows

                const cols: CSVColumn[] = headers.map((header, index) => ({
                    index,
                    name: header,
                    // Keep empty strings so preview shows even if column is mostly empty
                    preview: previewRows.map(row => row[index] ?? ''),
                }));

                setColumns(cols);

                // Auto-map columns
                const autoMappings: Record<number, string> = {};
                cols.forEach(col => {
                    const headerLower = col.name.toLowerCase().replace(/[^a-z0-9]/g, '');

                    // Name fields
                    if (headerLower.includes('firstname') || headerLower === 'fname') {
                        autoMappings[col.index] = 'first_name';
                    } else if (headerLower.includes('lastname') || headerLower === 'lname') {
                        autoMappings[col.index] = 'last_name';
                    }

                    // Email columns (supports email1, email2, etc.)
                    else if (headerLower.startsWith('email')) {
                        autoMappings[col.index] = 'email';
                    }

                    // Phone columns (supports phone1, phone2, mobile, etc.)
                    else if (headerLower.startsWith('phone') || headerLower.includes('mobile')) {
                        autoMappings[col.index] = 'phone';
                    }

                    // Other fields
                    else if (headerLower.includes('address') && !headerLower.includes('email')) {
                        autoMappings[col.index] = 'address';
                    } else if (headerLower === 'city') {
                        autoMappings[col.index] = 'city';
                    } else if (headerLower === 'state') {
                        autoMappings[col.index] = 'state';
                    } else if (headerLower.includes('zip')) {
                        autoMappings[col.index] = 'zip_code';
                    } else if (headerLower.includes('birth')) {
                        autoMappings[col.index] = 'birthdate';
                    } else if (headerLower.includes('source')) {
                        autoMappings[col.index] = 'source';
                    } else if (headerLower.includes('status')) {
                        autoMappings[col.index] = 'status';
                    } else if (headerLower.includes('price')) {
                        autoMappings[col.index] = 'price_range';
                    } else if (headerLower.includes('timeframe') || headerLower.includes('timeline')) {
                        autoMappings[col.index] = 'timeframe';
                    } else if (headerLower.includes('lender')) {
                        autoMappings[col.index] = 'lender';
                    } else if (headerLower.includes('tag') || headerLower.includes('tags')) {
                        autoMappings[col.index] = 'tags';
                    } else {
                        autoMappings[col.index] = 'ignore';
                    }
                });

                setColumnMappings(autoMappings);
                setStep('mapping');
            },
            error: (err) => {
                console.error('CSV parse error:', err);
                toast.error('Failed to parse CSV file.');
            }
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleImport = async () => {
        // Validate required fields
        const mappedFields = Object.values(columnMappings);
        if (!mappedFields.includes('first_name') || !mappedFields.includes('last_name')) {
            toast.error('First Name and Last Name are required fields');
            return;
        }

        setStep('importing');

        try {
            const contacts = csvData.slice(1).map(row => {
                const raw: any = {};
                Object.entries(columnMappings).forEach(([colIndex, fieldName]) => {
                    if (fieldName !== 'ignore') {
                        const value = row[parseInt(colIndex)];
                        if (value && value.trim()) {
                            raw[fieldName] = raw[fieldName] ? raw[fieldName] + ',' + value.trim() : value.trim();
                        }
                    }
                });
                type PhoneNumber = {
                    number: string;
                    type: string;
                    is_primary: boolean;
                };

                type Email = {
                    email: string;
                    type: string;
                    is_primary: boolean;
                };

                // --- TRANSFORM INTO BACKEND FORMAT ---
                const contact: {
                    first_name: string;
                    last_name: string;
                    birthdate: string;
                    source: string;
                    status: string;
                    address: string;
                    city: string;
                    state: string;
                    zipCode: string;
                    lender: string;
                    price_range: string;
                    timeframe: string;
                    owner_id: string;
                    phone_numbers: PhoneNumber[];
                    emails: Email[];
                    tags: string[];
                } = {
                    first_name: raw.first_name || "",
                    last_name: raw.last_name || "",
                    birthdate: raw.birthdate || "",
                    source: raw.source || "",
                    status: raw.status || "",
                    address: raw.address || "",
                    city: raw.city || "",
                    state: raw.state || "",
                    zipCode: raw.zip_code || "",
                    lender: raw.lender || "",
                    price_range: raw.price_range || "",
                    timeframe: raw.timeframe || "",
                    owner_id: userId,
                    phone_numbers: [],
                    emails: [],
                    tags: [],
                };

                // Emails (support multiple)
                if (raw.email) {
                    raw.email.split(',').forEach((e: string, i: number) => {
                        contact.emails.push({
                            email: e.trim(),
                            type: 'personal',
                            is_primary: i === 0,
                        });
                    });
                }

                // Phones (support multiple)
                if (raw.phone) {
                    raw.phone.split(',').forEach((p: string, i: number) => {
                        contact.phone_numbers.push({
                            number: p.trim(),
                            type: 'mobile',
                            is_primary: i === 0,
                        });
                    });
                }

                // ---- TAGS (comma separated: "buyer, seller") ----
                if (raw.tags) {
                    contact.tags = raw.tags
                        .split(',')
                        .map((t: string) => t.trim())
                        .filter(Boolean);
                }

                return contact;
            });

            // Send to backend
            const response = await fetch(`${BASE_URL}/contacts/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contacts),
            });

            if (!response.ok) throw new Error('Failed to import contacts');

            toast.success(`Successfully imported contacts`);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Failed to import contacts.');
            setStep('mapping');
        }
    };

    const handleClose = () => {
        setStep('upload');
        setFile(null);
        setCsvData([]);
        setColumns([]);
        setColumnMappings({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Contacts</DialogTitle>
                    <DialogDescription>
                        {step === 'upload' && 'Upload a CSV file with your contacts'}
                        {step === 'mapping' && 'Map your CSV columns to contact fields'}
                        {step === 'importing' && 'Importing your contacts...'}
                    </DialogDescription>
                </DialogHeader>

                {/* Upload Step */}
                {step === 'upload' && (
                    <div className="space-y-4">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600'
                                }`}
                        >
                            <svg
                                className="mb-4 h-12 w-12 text-zinc-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {isDragging ? 'Drop your file here' : 'Drag and drop your CSV file'}
                            </p>
                            <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">or</p>
                            <label>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    className="hidden"
                                />
                                <Button type="button" variant="outline" asChild>
                                    <span>Browse Files</span>
                                </Button>
                            </label>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                            <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">CSV Format Requirements:</h4>
                            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                                <li>• First row should contain column headers</li>
                                <li>• Required fields: First Name, Last Name</li>
                                <li>• Optional fields: Email, Phone, Address, City, State, Zip Code, etc.</li>
                                <li>• One contact per row</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Mapping Step */}
                {step === 'mapping' && (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                <strong>{csvData.length - 1}</strong> contacts found in <strong>{file?.name}</strong>
                            </p>
                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                Map each column from your CSV to the corresponding contact field. We've automatically mapped common fields for you.
                            </p>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {columns.map((col) => (
                                <div key={col.index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                CSV Column: <span className="font-bold text-blue-600 dark:text-blue-400">{col.name}</span>
                                            </label>
                                            {col.preview.length > 0 && (
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                    Preview: {col.preview.slice(0, 2).join(', ')}
                                                    {col.preview.length > 2 && '...'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-64">
                                            <Select
                                                value={columnMappings[col.index] || 'ignore'}
                                                onValueChange={(value) => {
                                                    setColumnMappings({ ...columnMappings, [col.index]: value });
                                                }}
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
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                            <Button variant="outline" onClick={() => setStep('upload')}>
                                Back
                            </Button>
                            <Button onClick={handleImport}>
                                Import {csvData.length - 1} Contacts
                            </Button>
                        </div>
                    </div>
                )}

                {/* Importing Step */}
                {step === 'importing' && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-500"></div>
                        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Importing contacts...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

