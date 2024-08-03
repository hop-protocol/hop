/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose', // Ensure ESM compatibility
  }
};

export default nextConfig;
