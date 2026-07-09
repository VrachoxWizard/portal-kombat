import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.mmafighting.com",
      },
      {
        protocol: "https",
        hostname: "**.boxingscene.com",
      },
      {
        protocol: "https",
        hostname: "**.boxingnews24.com",
      },
      {
        protocol: "https",
        hostname: "**.ufc.com",
      },
      {
        protocol: "https",
        hostname: "**.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
      },
    ],
  },
};

export default nextConfig;
