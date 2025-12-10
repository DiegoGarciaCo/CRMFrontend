'use client';

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { ContactsBySourceRow } from "@/lib/definitions/backend/contacts";

interface ContactCountsBySourceProps {
    contactCounts: ContactsBySourceRow[];
}

export default function ContactCountsBySource({ contactCounts }: ContactCountsBySourceProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Contacts by Source
            </h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Contact Count</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contactCounts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        contactCounts.map((row, index) => (
                            <TableRow key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <TableCell>
                                    {row.Source.Valid ? row.Source.String : '—'}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {row.ContactCount}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
