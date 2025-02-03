import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/premium_photo-*",
      },
    ],
  },
};

export default nextConfig;
