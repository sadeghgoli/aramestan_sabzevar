import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://apikiosk.aramestan.sabzevar.ir/api/:path*'
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
