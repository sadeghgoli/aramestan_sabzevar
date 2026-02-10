import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://apikiosk.aramestan.sabzevar.ir/api/:path*'
      }
    ]
  }
};

export default nextConfig;
