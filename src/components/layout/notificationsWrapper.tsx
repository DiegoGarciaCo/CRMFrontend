"use client";

import { useRouter } from "next/navigation";
import NotificationsDropdown from "./NotificationsBell";
import { DeleteNotification, MarkAllNotificationsAsRead, MarkNotificationAsRead } from "@/lib/data/backend/clientCalls";
import { Notification } from "@/lib/definitions/backend/mentions";

interface NotificationsWrapperProps {
    notifications?: Notification[];
}

export default function NotificationsWrapper({ notifications = [] }: NotificationsWrapperProps) {
    const router = useRouter();

    const handleMarkAsRead = async (id: string) => {
        try {
            await MarkNotificationAsRead(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await MarkAllNotificationsAsRead();
            router.refresh();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await DeleteNotification(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return (
        <div className="z-50">
            <NotificationsDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDelete}
            />
        </div>
    );
}
