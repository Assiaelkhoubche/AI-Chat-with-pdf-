import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
    experimental: {
        serverComponentsExternalPackages: ["pdf-parse"],
    },
    images: {
        domains: ["avatar.iran.liara.run"], 
    },
};

export default nextConfig;
