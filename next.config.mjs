import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stubPath = path.resolve(__dirname, 'lib/stub-module.cjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pino', 'thread-stream', 'pino-pretty'],
  // Stub test-only deps so thread-stream test files bundled by Turbopack can resolve them
  turbopack: {
    resolveAlias: {
      'why-is-node-running': stubPath,
      tape: stubPath,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'why-is-node-running': stubPath,
      tape: stubPath,
    }
    return config
  },
}

export default nextConfig
