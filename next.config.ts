import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
