/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 256 * 100000,
  },
}

module.exports = nextConfig
