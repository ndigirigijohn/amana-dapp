export const NETWORK = 'preview'; // 'preview', 'preprod', 'mainnet'

export const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID || '';

// Path to the Plutus script JSON
export const PLUTUS_SCRIPT_PATH = 'src/sc/plutus.json';

// Wallet config - IMPORTANT: In production, use a more secure method
export const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS || '';
export const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

// Contract Parameters
export const MIN_UTXO_LOVELACE = 2000000; // 2 ADA minimum for output with datum

// File to save deployment results
export const DEPLOYMENT_RESULTS_PATH = 'src/sc/deployment-results.json';