/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Avoid Turbopack bundling test files and optional deps inside these packages
  serverExternalPackages: ['pino', 'thread-stream', 'pino-pretty'],
}

export default nextConfig
