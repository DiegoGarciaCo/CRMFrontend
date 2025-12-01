import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs", // Required for auth.api calls
    matcher: [
        "/",
        "/people/:path*",
        "/appointments/:path*",
        "/deals/:path*",
        "/goals/:path*",
        "/organizations/:path*",
        "/profiles/:path*",
        "/tasks/:path*",
    ],
};
