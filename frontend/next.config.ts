import type { NextConfig } from 'next';

const backendOrigin =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ||
  (process.env.NODE_ENV === 'production' ? 'https://mush-ih5l.onrender.com' : 'http://127.0.0.1:8000');

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
        destination: `${backendOrigin}/api/:path*/`,
      },
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*/`,
      },
      {
        source: '/admin/:path*',
        destination: `${backendOrigin}/admin/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendOrigin}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
