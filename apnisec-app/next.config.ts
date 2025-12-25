import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // Suppress hydration warnings for known extension mismatches (dev-only hack)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: If it's font-related, preload fonts explicitly
  experimental: {
    optimizePackageImports: ["@fontsource/inter"], // If using fontsource alternative
  },
};

export default nextConfig;
