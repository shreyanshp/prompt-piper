/** @type {import('next').NextConfig} */
const nextConfig = {
  // Choose one of the following based on your needs:

  // Option 1: For @cloudflare/next-on-pages (supports API routes, SSR)
  // Comment this out if using static export
  experimental: {
    runtime: 'edge', // Use edge runtime for better Cloudflare compatibility
  },

  // Option 2: For static export (no API routes, client-side only)
  // Uncomment this for simple static site deployment
  output: 'export',

  // Disable Next.js image optimization (required for Cloudflare Pages)
  images: {
    unoptimized: true,
  },

  // Optional: Add trailing slashes for better static site compatibility
  trailingSlash: true,

  // Custom webpack configuration for Hugging Face Transformers
  webpack: (config, { isServer }) => {
    // Fix for @tensorflow/tfjs and @huggingface/transformers
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
    };

    // Handle native modules
    config.module.rules.push({
      test: /\.node$/,
      loader: 'ignore-loader',
    });

    // Ignore transformers backend issues for server-side
    if (isServer) {
      config.externals = [...(config.externals || []), '@tensorflow/tfjs', '@huggingface/transformers'];
    }

    // Ignore ONNX runtime for client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
        'onnxruntime-web': 'onnxruntime-web',
      };
    }

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@tensorflow\/tfjs/ },
      { module: /node_modules\/@huggingface\/transformers/ },
      { module: /node_modules\/onnxruntime/ },
    ];

    return config;
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Prompt Piper App',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
    // Suppress ONNX runtime warnings
    ORT_LOGGING_LEVEL: '3', // Error level only
  },

  // Load environment variables from CLI config
  async env() {
    const fs = require('fs');
    const path = require('path');

    // Try to load from CLI config.env
    const cliConfigPath = path.join(__dirname, '../cli/config.env');
    let envVars = {};

    if (fs.existsSync(cliConfigPath)) {
      const configContent = fs.readFileSync(cliConfigPath, 'utf8');
      configContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });
    }

    return {
      ...envVars,
      // Fallback API keys (replace with your actual keys)
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || envVars.ANTHROPIC_API_KEY || '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || envVars.OPENAI_API_KEY || '',
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || envVars.OPENROUTER_API_KEY || '',
    };
  },
}

module.exports = nextConfig