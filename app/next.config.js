/** @type {import('next').NextConfig} */
const nextConfig = {
  // Choose one of the following based on your needs:
  
  // Option 1: For @cloudflare/next-on-pages (supports API routes, SSR)
  // Comment this out if using static export
  /*
  experimental: {
    runtime: 'edge', // Use edge runtime for better Cloudflare compatibility
  },
  */
  
  // Option 2: For static export (no API routes, client-side only)
  // Uncomment this for simple static site deployment
  output: 'export',
  
  // Disable Next.js image optimization (required for Cloudflare Pages)
  images: {
    unoptimized: true,
  },
  
  // Optional: Add trailing slashes for better static site compatibility
  trailingSlash: true,
  
  // Optional: Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add any custom webpack configs here
    return config;
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Prompt Piper App',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },
}

module.exports = nextConfig