import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { GetNotificationsForUser } from "@/lib/data/backend/mentions";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Realtor CRM - Lead Management System",
    description: "Manage your real estate leads, clients, and appointments",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;
    const notifications = await GetNotificationsForUser();

    if (!userId) {
        throw new Error('User not authenticated');
    }
    return (
        <main
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <Navbar userId={userId} notifications={notifications} />
            {children}
            <Toaster position="top-right" />
        </main>
    );
}
