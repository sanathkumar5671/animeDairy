import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/file/anilistcdn/media/anime/cover/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
