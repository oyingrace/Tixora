import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // serverExternalPackages: [
    //   "pino",
    //   "thread-stream",
    //   "@tapjs/fixture",
    //   "rimraf"
    // ]
  }, 
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone'
};

export default nextConfig;
