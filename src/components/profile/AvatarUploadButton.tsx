"use client";

import { useRef } from "react";
import Image from "next/image";
import { User } from "lucide-react"; // your fallback icon

export default function AvatarUpload({ session }: { session: any }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const onUpload = async (file: File) => {
        // Placeholder for upload logic
        console.log("Uploading file:", file);
        // Implement actual upload logic here, e.g., call an API endpoint
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file); // send file to backend
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <div
                className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={handleClick}
            >
                {session.user.image ? (
                    <Image
                        width={64}
                        height={64}
                        src={session.user.image}
                        alt="User Avatar"
                        className="object-cover"
                    />
                ) : (
                    <User className="size-8 text-muted-foreground" />
                )}
            </div>
        </>
    );
}
