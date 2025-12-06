import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "crm-51916.s3.us-east-2.amazonaws.com",
                port: "",
                pathname: "/**", // must include /** to allow all S3 objects
            },
        ],
    },
};

export default nextConfig;
