'use client';

import { ContactsBySourceRow } from "@/lib/definitions/backend/contacts";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

interface ContactCountsBySourceTableProps {
    contactCounts: ContactsBySourceRow[];
}

export default function ContactCountsBySourceTable({
    contactCounts,
}: ContactCountsBySourceTableProps) {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white px-6 pb-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-h-80 overflow-y-auto">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 sticky top-0 bg-white dark:bg-zinc-900 py-2 z-10 -mx-6 px-6 pt-6 border-zinc-200 dark:border-zinc-800">
                Contacts by Source
            </h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Contact Count</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contactCounts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center py-8 text-zinc-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        contactCounts.map((row, idx) => (
                            <TableRow
                                key={idx}
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-default"
                            >
                                <TableCell>
                                    {row.Source?.Valid ? row.Source.String : "—"}
                                </TableCell>
                                <TableCell>{row.ContactCount}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
