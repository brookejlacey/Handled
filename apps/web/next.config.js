/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@handled/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  eslint: {
    // Disable ESLint during builds (monorepo parser issue)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is done separately
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
