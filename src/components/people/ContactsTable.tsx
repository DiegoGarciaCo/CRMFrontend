'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { useState, useMemo } from 'react';

interface ContactsTableProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

type SortField = 'name' | 'email' | 'status' | 'source' | 'created';
type SortDirection = 'asc' | 'desc';

export default function ContactsTable({ contacts, onContactClick }: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter((contact) => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${contact.FirstName} ${contact.LastName}`.toLowerCase();
      const status = contact.Status.Valid ? contact.Status.String.toLowerCase() : '';
      const source = contact.Source.Valid ? contact.Source.String.toLowerCase() : '';
      
      return fullName.includes(searchLower) || status.includes(searchLower) || source.includes(searchLower);
    });

    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'name':
          aVal = `${a.FirstName} ${a.LastName}`;
          bVal = `${b.FirstName} ${b.LastName}`;
          break;
        case 'status':
          aVal = a.Status.Valid ? a.Status.String : '';
          bVal = b.Status.Valid ? b.Status.String : '';
          break;
        case 'source':
          aVal = a.Source.Valid ? a.Source.String : '';
          bVal = b.Source.Valid ? b.Source.String : '';
          break;
        case 'created':
          aVal = a.CreatedAt.Valid ? new Date(a.CreatedAt.Time).getTime() : 0;
          bVal = b.CreatedAt.Valid ? new Date(b.CreatedAt.Time).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [contacts, searchTerm, sortField, sortDirection]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'qualified':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredAndSortedContacts.length} contacts
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <tr>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' && (
                      <svg
                        className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Contact Info
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && (
                      <svg
                        className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onClick={() => handleSort('source')}
                >
                  <div className="flex items-center gap-2">
                    Source
                    {sortField === 'source' && (
                      <svg
                        className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Price Range
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onClick={() => handleSort('created')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    {sortField === 'created' && (
                      <svg
                        className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredAndSortedContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
                    No contacts found
                  </td>
                </tr>
              ) : (
                filteredAndSortedContacts.map((contact) => (
                  <tr
                    key={contact.ID}
                    onClick={() => onContactClick(contact)}
                    className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {contact.FirstName} {contact.LastName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {contact.Address.Valid && contact.Address.String && (
                          <div className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{contact.City.Valid ? contact.City.String : 'N/A'}, {contact.State.Valid ? contact.State.String : 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {contact.Status.Valid && (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contact.Status.String)}`}>
                          {contact.Status.String}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {contact.Source.Valid ? contact.Source.String : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {contact.PriceRange.Valid ? contact.PriceRange.String : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {contact.CreatedAt.Valid ? formatDate(contact.CreatedAt.Time) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

