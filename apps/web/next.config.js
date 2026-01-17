/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@handled/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
    ],
  },
};

module.exports = nextConfig;
