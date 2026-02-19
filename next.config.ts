import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'http://apikiosk.aramestan.sabzevar.ir/:path*'
      }
    ]
  },
  images: {
    domains: ['kiosk.aramestan.sabzevar.ir'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'kiosk.aramestan.sabzevar.ir',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
