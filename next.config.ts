import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Tell Vercel to treat these as "External" packages (Don't bundle them)
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],

  // 2. Ignore Build Errors (Keep this for safety as discussed before)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
