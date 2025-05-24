/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable WebAssembly experiments
  webpack: (config, { isServer }) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Add rule for WebAssembly modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Ensure WASM files are not processed by other loaders
    config.resolve.extensions.push('.wasm');

    // Fix for server-side rendering issues with WASM
    if (isServer) {
      config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm';
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    return config;
  },
  
  // Disable strict mode for better compatibility with blockchain libraries
  reactStrictMode: false,
  
  // Add environment variables that should be available client-side
  env: {
    NEXT_PUBLIC_BLOCKFROST_PROJECT_ID: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  },
};

export default nextConfig;