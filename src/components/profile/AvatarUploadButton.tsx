"use client";

import { useRef } from "react";
import Image from "next/image";
import { User } from "lucide-react"; // your fallback icon
import { toast } from "sonner";

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

export default function AvatarUpload({ session }: { session: any }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const onUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${BASE_URL}/upload-profile-picture`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
        });

        if (!res.ok) {
            toast.error(`Error uploading profile picture: ${res.statusText}`);
        }
        else {
            toast.success('Profile picture uploaded successfully!');
            location.reload();
        }
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
