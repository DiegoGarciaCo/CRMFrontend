"use client";

import { Contact } from "@/lib/definitions/backend/contacts";
import Link from "next/link";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

interface RecentContactsProps {
    contacts: Contact[];
}

export default function RecentContactsTable({ contacts }: RecentContactsProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "new":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "active":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "qualified":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case "negotiating":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default:
                return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Recent Contacts
                </h2>
                <Link
                    href="/people"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View All
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {contacts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                No recent contacts
                            </TableCell>
                        </TableRow>
                    ) : (
                        contacts.map((contact) => (
                            <TableRow
                                key={contact.ID}
                                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() =>
                                    (window.location.href = `/people/${contact.ID}`)
                                }
                            >
                                <TableCell className="font-medium">
                                    {contact.FirstName} {contact.LastName}
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    {contact.Status.Valid && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                                contact.Status.String
                                            )}`}
                                        >
                                            {contact.Status.String}
                                        </span>
                                    )}
                                </TableCell>

                                {/* Source */}
                                <TableCell>
                                    {contact.Source.Valid ? contact.Source.String : "—"}
                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
