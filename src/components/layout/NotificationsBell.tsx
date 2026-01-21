import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Notification } from '@/lib/definitions/backend/mentions';
import { useRouter } from 'next/navigation';


interface NotificationsDropdownProps {
    notifications?: Notification[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
    onDelete?: (id: string) => void;
}

export default function NotificationsDropdown({
    notifications = [],
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete
}: NotificationsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const unreadCount = notifications ? notifications?.filter(n => !n.Read.Bool).length : 0;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const formatTimeAgo = (date: Date | string) => {
        const d = date instanceof Date ? date : new Date(date);

        const seconds = Math.floor(
            (Date.now() - d.getTime()) / 1000
        );

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'mention':
                return '💬';
            case 'TASK':
                return '✓';
            case 'APPOINTMENT':
                return '📅';
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            Notifications
                        </h3>
                        {unreadCount > 0 && onMarkAllAsRead && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.ID}
                                        onClick={() => {
                                            if (notification.ContactID) {
                                                router.push(`/people/${notification.ContactID}`);
                                            }
                                        }}
                                        className={`group relative cursor-pointer p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${!notification.Read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-2xl">
                                                {getNotificationIcon(notification.Type)}
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                                                    {notification.Message}
                                                </p>
                                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                    {formatTimeAgo(notification.CreatedAt.Time)}
                                                </p>
                                            </div>

                                            <div className="flex gap-1">
                                                {!notification.Read && onMarkAsRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMarkAsRead(notification.ID);
                                                        }}
                                                        className="rounded p-1 text-zinc-400 opacity-0 hover:bg-zinc-200 hover:text-zinc-600 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {onDelete && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(notification.ID);
                                                        }}
                                                        className="cursor-pointer rounded p-1 text-zinc-400 opacity-0 hover:bg-zinc-200 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
