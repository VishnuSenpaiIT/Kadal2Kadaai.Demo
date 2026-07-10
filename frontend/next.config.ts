import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.npm_lifecycle_event === 'dev:admin' ? '.next-admin' : '.next',
};

export default nextConfig;
