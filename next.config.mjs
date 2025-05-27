/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable WebAssembly experiments
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable WebAssembly and other experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // Add rule for WebAssembly modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Ensure WASM files are not processed by other loaders
    config.resolve.extensions.push('.wasm');

    // Handle WASM file output paths
    if (isServer) {
      config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm';
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    // Add fallbacks for Node.js modules that aren't available in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      buffer: false,
    };

    // Provide global polyfills for browser environment
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );

    // Handle externals for server-side rendering
    if (isServer) {
      config.externals = [
        ...config.externals,
        // Externalize problematic packages during SSR
        {
          '@lucid-evolution/lucid': 'commonjs @lucid-evolution/lucid',
          '@lucid-evolution/plutus': 'commonjs @lucid-evolution/plutus',
          '@lucid-evolution/utils': 'commonjs @lucid-evolution/utils',
          '@lucid-evolution/core-types': 'commonjs @lucid-evolution/core-types',
          '@meshsdk/core': 'commonjs @meshsdk/core',
          '@meshsdk/wallet': 'commonjs @meshsdk/wallet',
        },
        // Function to handle dynamic externals
        ({ context, request }, callback) => {
          // Externalize all @lucid-evolution packages
          if (request.startsWith('@lucid-evolution/')) {
            return callback(null, `commonjs ${request}`);
          }
          
          // Externalize all @meshsdk packages
          if (request.startsWith('@meshsdk/')) {
            return callback(null, `commonjs ${request}`);
          }
          
          // Externalize cardano-related packages
          if (request.includes('cardano') && 
              (request.includes('wasm') || request.includes('multiplatform'))) {
            return callback(null, `commonjs ${request}`);
          }
          
          callback();
        },
      ];
    }

    // Ignore specific modules that cause issues during build
    config.module.rules.push({
      test: /node_modules\/@lucid-evolution.*\.js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle import resolution for ES modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Optimize chunks to separate vendor libraries
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          cardano: {
            name: 'cardano',
            test: /[\\/]node_modules[\\/](@lucid-evolution|@meshsdk)[\\/]/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
  
  // Disable strict mode for better compatibility with blockchain libraries
  reactStrictMode: false,
  
  // Add environment variables that should be available client-side
  env: {
    NEXT_PUBLIC_BLOCKFROST_PROJECT_ID: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  },

  // Configure compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },

  // Configure headers for better security and WASM support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/static/wasm/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configure image domains if needed
  images: {
    domains: [],
    unoptimized: true, // Disable image optimization to avoid build issues
  },

  // Configure external packages for server components
  serverExternalPackages: [
    '@lucid-evolution/lucid',
    '@lucid-evolution/plutus',
    '@lucid-evolution/utils',
    '@lucid-evolution/core-types',
    '@meshsdk/core',
    '@meshsdk/wallet',
  ],

  // Configure ESLint
  eslint: {
    // Ignore ESLint errors during build for blockchain packages
    ignoreDuringBuilds: true,
  },

  // Configure TypeScript
  typescript: {
    // Ignore TypeScript errors during build for faster development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;