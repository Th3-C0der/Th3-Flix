import withPWAInit from "@ducanh2912/next-pwa";
import { NextConfig } from "next/dist/server/config";

// Temporarily disable PWA for testing
const withPWA = (config: NextConfig): NextConfig => config;

// Enable this when PWA is working correctly
// const withPWA = withPWAInit({
//   dest: "public",
//   register: true,
//   disable: process.env.NODE_ENV === "development",
//   reloadOnOnline: true,
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   workboxOptions: {
//     skipWaiting: true,
//     disableDevLogs: true,
//     runtimeCaching: [
//       {
//         urlPattern: /^https?:\/\/image\.tmdb\.org\/.*/i,
//         handler: 'CacheFirst',
//         options: {
//           cacheName: 'tmdb-images',
//           expiration: {
//             maxEntries: 1000,
//             maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
//           },
//           cacheableResponse: {
//             statuses: [0, 200],
//           },
//         },
//       },
//     ],
//   },
// });

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // https://github.com/payloadcms/payload/issues/12550#issuecomment-2939070941
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  experimental: {
    optimizePackageImports: ["@heroui/react"],
  },
  // Disable image optimization and caching
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable caching by setting minimumCacheTTL to 0
    minimumCacheTTL: 0,
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    // Disable image optimization to prevent any caching issues
    unoptimized: true,
    // Disable formats to prevent any processing
    formats: [],
    domains: [
      'image.tmdb.org',
      'www.themoviedb.org',
      'themoviedb.org',
      '*.tmdb.org',
      '*.themoviedb.org'
    ]
  },
  // Headers to prevent caching - REMOVED for output: export compatibility
  // async headers() {
  //   return [];
  // }
};

const pwa = withPWA(nextConfig);

export default pwa;
