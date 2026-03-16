import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stubPath = path.resolve(__dirname, 'lib/stub-module.cjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/marketplace", destination: "/invest/marketplace", permanent: false },
      { source: "/my-investments", destination: "/invest/my-investments", permanent: false },
      { source: "/royalties", destination: "/invest/royalties", permanent: false },
      { source: "/my-properties", destination: "/property/my-properties", permanent: false },
      { source: "/add-property", destination: "/property/add-property", permanent: false },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pino', 'thread-stream', 'pino-pretty'],
  // Use webpack for build so pino/thread-stream test dirs are not bundled (Turbopack pulls them in)
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'why-is-node-running': stubPath,
      tape: stubPath,
      tap: stubPath,
      desm: stubPath,
      fastbench: stubPath,
      'pino-elasticsearch': stubPath,
    }
    return config
  },
}

export default nextConfig
