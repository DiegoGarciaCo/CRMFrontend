'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { useEffect } from 'react';

interface ContactDetailsDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDetailsDrawer({ contact, isOpen, onClose }: ContactDetailsDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!contact) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 dark:bg-zinc-900 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {contact.FirstName} {contact.LastName}
              </h2>
              {contact.Status.Valid && (
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(contact.Status.String)}`}>
                  {contact.Status.String}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Contact Information
              </h3>
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                {contact.Address.Valid && contact.Address.String && (
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.Address.String}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {contact.City.Valid && contact.City.String}, {contact.State.Valid && contact.State.String} {contact.ZipCode.Valid && contact.ZipCode.String}
                      </div>
                    </div>
                  </div>
                )}
                {contact.Birthdate.Valid && contact.Birthdate.Time && (
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100">
                      {formatDate(contact.Birthdate.Time)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Preferences */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Property Preferences
              </h3>
              <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50 sm:grid-cols-2">
                {contact.PriceRange.Valid && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Price Range</div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {contact.PriceRange.String}
                    </div>
                  </div>
                )}
                {contact.Timeframe.Valid && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Timeframe</div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {contact.Timeframe.String}
                    </div>
                  </div>
                )}
                {contact.Lender.Valid && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Lender</div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {contact.Lender.String}
                    </div>
                  </div>
                )}
                {contact.Source.Valid && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Source</div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {contact.Source.String}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Timeline
              </h3>
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                {contact.CreatedAt.Valid && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Created</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDate(contact.CreatedAt.Time)}
                    </span>
                  </div>
                )}
                {contact.LastContactedAt.Valid && contact.LastContactedAt.Time && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Last Contacted</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDate(contact.LastContactedAt.Time)}
                    </span>
                  </div>
                )}
                {contact.UpdatedAt.Valid && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Last Updated</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDate(contact.UpdatedAt.Time)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Edit Contact
            </button>
            <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

