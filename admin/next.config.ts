import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hbbggntvibnvcrnceezi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
