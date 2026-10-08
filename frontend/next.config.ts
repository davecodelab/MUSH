import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'http://127.0.0.1:8000/api/:path*/',
      },
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*/',
      },
      {
        source: '/admin/:path*',
        destination: 'http://127.0.0.1:8000/admin/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      },
    ];
  },
};

export default nextConfig;
