"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserMenuButton() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        authClient.getSession().then((session) => {
            setUser(session?.data?.user ?? null);
        });
    }, []);

    if (!user) {
        return null; // not logged in
    }

    const initials = getInitials(user?.name, user?.email);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt="User Avatar"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <span className="text-sm font-medium">{initials}</span>
                        </div>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name ?? "User"}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                >
                    <User className="mr-2 h-4 w-4" />
                    My Account
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/organizations")}
                    className="cursor-pointer"
                >
                    <User className="mr-2 h-4 w-4" />
                    Organizations
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer"
                >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={async () => {
                        await authClient.signOut();
                        router.push("/auth/login"); // or wherever your login page is
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function getInitials(name?: string | null, email?: string) {
    if (name) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }
    return email?.[0]?.toUpperCase() ?? "?";
}
