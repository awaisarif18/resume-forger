import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 1. Ignore TypeScript Errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. Ignore ESLint Errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
