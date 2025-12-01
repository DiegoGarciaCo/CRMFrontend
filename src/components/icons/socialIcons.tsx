// icons.tsx
import type { ComponentProps, ElementType } from "react";

export const GoogleIcon: ElementType<ComponentProps<"svg">> = (props) => (
    <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label="Google"
        {...props}
    >
        <title>Google</title>

        <g transform="translate(2 2)">
            <circle cx="8" cy="4" r="4" fill="#4285F4" />
            <circle cx="14" cy="8" r="4" fill="#EA4335" />
            <circle cx="10" cy="14" r="4" fill="#FBBC05" />
            <circle cx="4" cy="10" r="4" fill="#34A853" />
        </g>
    </svg>
);

export const AppleIcon: ElementType<ComponentProps<"svg">> = (props) => (
    <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label="Apple"
        {...props}
    >
        <title>Apple</title>
        <path
            d="M16.2 2.6c-.9.1-2 .6-2.7 1.4-.6.7-1.1 1.9-.8 3.1 1.2.1 2.3-.6 3.1-1.4.6-.6 1-1.5 1-2.4 0-.1 0-.4-.6-.7zM12 5.2c-.8 0-1.8.4-2.6 1.2C7.8 7 6.9 8.6 6.9 10.5c0 2.5 1.9 4.3 3.5 4.3.8 0 1.3-.3 2-.3.7 0 1.2.3 2 .3 1.6 0 3.5-1.8 3.5-4.3 0-1.9-.9-3.5-2.5-4.1C13.8 5.6 12.8 5.2 12 5.2z"
            fill="currentColor"
        />
        <path
            d="M11.2 3.2c.1-.7.7-1.5 1.5-1.7-.1.7-.5 1.4-1.1 1.9-.1 0-.3-.1-.4-.2z"
            fill="currentColor"
        />
    </svg>
);
