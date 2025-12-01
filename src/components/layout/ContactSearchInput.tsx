'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { SearchContacts } from '@/lib/data/backend/contacts';
import { toast } from 'sonner';

interface Contact {
    ID: string;
    FirstName: string;
    LastName: string;
}

interface ContactSearchInputProps {
    ownerID: string;
}

export default function ContactSearchInput({ ownerID }: ContactSearchInputProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const contacts = await SearchContacts(ownerID, query);
                setResults(contacts);
            } catch (err) {
                console.error(err);
                toast.error('Failed to search contacts');
            } finally {
                setLoading(false);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(timeout);
    }, [query, ownerID]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    onClick={() => {
                        setOpen(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
                <Input
                    ref={inputRef}
                    placeholder="Search contacts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-2"
                />
                {loading && <p className="text-sm text-zinc-500">Searching...</p>}
                {!loading && (results ?? []).length === 0 && query && (
                    <p className="text-sm text-zinc-500">No contacts found</p>
                )}
                <div className="flex flex-col">
                    {(results ?? []).map((contact) => (
                        <button
                            key={contact.ID}
                            className="text-left px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => {
                                setOpen(false);
                                setQuery('');
                                router.push(`/people/${contact.ID}`);
                            }}
                        >
                            {contact.FirstName} {contact.LastName}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

