"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NotificationsDropdown from "./NotificationsBell";
import { DeleteNotification, GetNotificationsForUser, MarkAllNotificationsAsRead, MarkNotificationAsRead } from "@/lib/data/backend/clientCalls";
import { Notification } from "@/lib/definitions/backend/mentions";

interface NotificationsWrapperProps {
    initialNotifications?: Notification[];
}

export default function NotificationsWrapper({ initialNotifications = [] }: NotificationsWrapperProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const pathname = usePathname();

    // Fetch notifications on mount and when pathname changes
    useEffect(() => {
        fetchNotifications();
    }, [pathname]);

    // Optional: Poll for new notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await GetNotificationsForUser();

            setNotifications(response);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await MarkNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.ID === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await MarkAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await DeleteNotification(id);
            setNotifications(prev => prev.filter(n => n.ID !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return (
        <div>
            <NotificationsDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDelete}
            />
        </div>
    );
}
