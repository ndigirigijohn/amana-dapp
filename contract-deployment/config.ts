// offchain/config.ts
import * as dotenv from 'ts-dotenv';

// Load environment variables
export const env = dotenv.load({
  MNEMONIC: String,
  NETWORK: {
    type: String,
    default: 'preview'
  },
  BLOCKFROST_PROJECT_ID: String
});

// Network configurations
export const networks = {
  preview: {
    url: 'https://cardano-preview.blockfrost.io/api/v0',
    projectId: env.BLOCKFROST_PROJECT_ID
  },
  preprod: {
    url: 'https://cardano-preprod.blockfrost.io/api/v0',
    projectId: env.BLOCKFROST_PROJECT_ID
  },
  mainnet: {
    url: 'https://cardano-mainnet.blockfrost.io/api/v0',
    projectId: env.BLOCKFROST_PROJECT_ID
  }
};

export const selectedNetwork = networks[env.NETWORK as keyof typeof networks];