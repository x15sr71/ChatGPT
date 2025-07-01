/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    asyncWebAssembly: true, // ✅ still valid
  },
  serverExternalPackages: ['@dqbd/tiktoken'], // ✅ moved here
};

export default nextConfig;
