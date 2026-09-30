/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  output: 'export', // static export for Cloudflare Pages
};
