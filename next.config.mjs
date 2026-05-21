/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.coolstay.co.kr" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
  webpack: (config) => {
    // Prevent .playwright-mcp directory from triggering file watcher
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /\.playwright-mcp/,
    };
    return config;
  },
};

export default nextConfig;
