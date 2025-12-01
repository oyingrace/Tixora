import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "pino",
      "thread-stream",
      "@tapjs/fixture",
      "rimraf"
    ]
  }, 
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
