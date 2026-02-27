const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      // Allow CDN used by backend for product images (both http and https just in case)
      { protocol: "https", hostname: "squadlog-cdn.up.railway.app", pathname: "/uploads/**" },
      { protocol: "http", hostname: "squadlog-cdn.up.railway.app", pathname: "/uploads/**" },
      // Backend uploads / external CDN (Top Products, Media, etc.)
      { protocol: "https", hostname: "squadcart-backend.up.railway.app", pathname: "/uploads/**" },
      { protocol: "http", hostname: "squadcart-backend.up.railway.app", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/uploads/**" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

module.exports = nextConfig;
