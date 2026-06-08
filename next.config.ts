import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: '/about', destination: '/philosophy', permanent: true },
      { source: '/analyze', destination: '/explore', permanent: true },
      { source: '/tips', destination: '/wiki', permanent: true },
    ];
  },
};

export default nextConfig;
