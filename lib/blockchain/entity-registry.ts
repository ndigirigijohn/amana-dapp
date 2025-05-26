// lib/blockchain/entity-registry.ts
import { Lucid, Blockfrost, TxHash, Data, SpendingValidator } from '@lucid-evolution/lucid';
import { validatorToAddress, getAddressDetails } from '@lucid-evolution/utils';
import { Network } from '@lucid-evolution/core-types';
import { BrowserWallet } from '@meshsdk/core';
import { loadValidators } from './validators';

// Configuration type for blockchain connection
export interface BlockchainConfig {
  network: 'Preview' | 'Preprod' | 'Mainnet';
  blockfrostUrl: string;
  blockfrostProjectId: string;
  contractAddress?: string;
}

// Result type for entity creation
export interface CreateEntityResult {
  txHash: TxHash;
  contractAddress: string;
  entityId: string; // For frontend tracking
  metadata?: any; // Include the metadata that was attached
}

// Error types for better error handling
export class EntityRegistryError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'EntityRegistryError';
  }
}

export class WalletConnectionError extends EntityRegistryError {
  constructor(message: string, cause?: Error) {
    super(`Wallet connection failed: ${message}`, cause);
    this.name = 'WalletConnectionError';
  }
}

export class TransactionError extends EntityRegistryError {
  constructor(message: string, cause?: Error) {
    super(`Transaction failed: ${message}`, cause);
    this.name = 'TransactionError';
  }
}

/**
 * Browser-compatible wrapper for Entity Registry operations
 */
export class BrowserEntityRegistry {
  private config: BlockchainConfig;
  private lucid: any = null;
  private contractAddress: string = '';
  private validatorScript: SpendingValidator;

  constructor(config: BlockchainConfig) {
    this.config = config;
    
    // Load validator
    const validators = loadValidators();
    this.validatorScript = {
      type: 'PlutusV2',
      script: validators.entityRegistry.compiledCode
    };
  }

  /**
   * Initialize the blockchain connection with a connected wallet
   * @param walletName - Name of the wallet (from Mesh SDK)
   */
async initialize(walletName: string): Promise<void> {
    try {
      console.log('BrowserEntityRegistry: Starting initialization with wallet:', walletName);
      
      // Initialize Lucid with Blockfrost first
      console.log('BrowserEntityRegistry: Initializing Lucid with network:', this.config.network);
      console.log('BrowserEntityRegistry: Blockfrost URL:', this.config.blockfrostUrl);
      
      this.lucid = await Lucid(
        new Blockfrost(
          this.config.blockfrostUrl,
          this.config.blockfrostProjectId
        ),
        this.config.network
      );
      
      console.log('BrowserEntityRegistry: Lucid initialized');

      // Connect to wallet using the CIP-30 API directly instead of Mesh SDK
      if (typeof window !== 'undefined' && (window as any).cardano) {
        console.log('BrowserEntityRegistry: Connecting to wallet via CIP-30...');
        
        let walletApi;
        const cardanoWallets = (window as any).cardano;
        
        // Try to connect to the specific wallet
        switch (walletName.toLowerCase()) {
          case 'nami':
            if (cardanoWallets.nami) {
              walletApi = await cardanoWallets.nami.enable();
            }
            break;
          case 'eternl':
            if (cardanoWallets.eternl) {
              walletApi = await cardanoWallets.eternl.enable();
            }
            break;
          case 'lace':
            if (cardanoWallets.lace) {
              walletApi = await cardanoWallets.lace.enable();
            }
            break;
          case 'flint':
            if (cardanoWallets.flint) {
              walletApi = await cardanoWallets.flint.enable();
            }
            break;
          case 'yoroi':
            if (cardanoWallets.yoroi) {
              walletApi = await cardanoWallets.yoroi.enable();
            }
            break;
          default:
            // Try a generic approach
            const walletKey = Object.keys(cardanoWallets).find(
              key => key.toLowerCase() === walletName.toLowerCase()
            );
            if (walletKey && cardanoWallets[walletKey]) {
              walletApi = await cardanoWallets[walletKey].enable();
            }
            break;
        }

        if (!walletApi) {
          throw new Error(`Wallet ${walletName} not found or not available`);
        }

        console.log('BrowserEntityRegistry: Wallet API obtained, connecting to Lucid...');
        
        // Connect wallet to Lucid using the CIP-30 API
        this.lucid.selectWallet.fromAPI(walletApi);
        console.log('BrowserEntityRegistry: Wallet connected to Lucid');

      } else {
        throw new Error('Browser wallet API not available');
      }

      // Get contract address
      const network = this.lucid.config().network as Network;
      this.contractAddress = validatorToAddress(network, this.validatorScript);

      console.log('Blockchain connection initialized successfully');
      console.log('Contract address:', this.contractAddress);
      
    } catch (error) {
      console.error('Failed to initialize blockchain connection:', error);
      throw new WalletConnectionError(
        'Failed to connect wallet and initialize blockchain',
        error as Error
      );
    }
  }

  /**
   * Create a new SACCO entity on the blockchain
   * @param name - Entity name
   * @param description - Entity description
   * @returns Promise with transaction hash and entity details
   */
async createEntity(name: string, description: string): Promise<CreateEntityResult> {
    if (!this.lucid) {
      throw new EntityRegistryError('Blockchain not initialized. Call initialize() first.');
    }

    // Validate inputs
    if (!name || name.trim().length === 0) {
      throw new EntityRegistryError('Entity name is required');
    }

    if (!description || description.trim().length === 0) {
      throw new EntityRegistryError('Entity description is required');
    }

    try {
      console.log(`Creating entity: ${name}`);
      
      console.log('Building transaction...');
      
      // Check UTXOs first
      const utxos = await this.lucid.wallet().getUtxos();
      console.log(`Found ${utxos.length} UTXOs`);
      
      if (utxos.length === 0) {
        throw new Error('No UTXOs found in wallet. Please ensure you have funds.');
      }

      // Check wallet balance
      const walletAddress = await this.lucid.wallet().address();
      console.log('Wallet address:', walletAddress);
      
      // Create metadata for the transaction (compliant with Lucid Evolution constraints)
      const entityMetadata = {
        "type": "sacco_entity",
        "platform": "Amana_CE",
        "version": "1.0",
        "name": name.length > 60 ? name.substring(0, 60) : name,
        "desc": description.length > 60 ? description.substring(0, 60) : description,
        "created": Math.floor(Date.now() / 1000), // Unix timestamp as number
        // Split wallet address into chunks to comply with 64-char limit
        "founder_1": walletAddress.substring(0, 60),
        "founder_2": walletAddress.substring(60) || "n/a"
      };
      
      // Build transaction with metadata using correct Lucid Evolution API
      console.log('Creating transaction with metadata...');
      const tx = this.lucid
        .newTx()
        .pay.ToAddress(this.contractAddress, { lovelace: BigInt(2000000) })
        .attachMetadata(674, entityMetadata); // Add metadata to transaction
      
      console.log('Completing transaction...');
      const completedTx = await tx.complete();
      console.log('Transaction completed successfully');
      
      console.log('Signing transaction...');
      const signedTx = await completedTx.sign.withWallet().complete();
      console.log('Transaction signed successfully');
      
      console.log('Submitting transaction...');
      const txHash = await signedTx.submit();
      console.log('Transaction submitted:', txHash);
      
      // Generate a unique entity ID for frontend tracking
      const entityId = `entity-${Date.now()}-${txHash.slice(-8)}`;
      
      const result: CreateEntityResult = {
        txHash,
        contractAddress: this.contractAddress,
        entityId,
        metadata: { 674: entityMetadata } // Wrap in proper structure for result
      };

      console.log(`Entity creation transaction submitted with metadata:`, result);
      
      return result;
      
    } catch (error) {
      console.error('Entity creation failed:', error);
      
      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes('Insufficient') || error.message.includes('insufficient')) {
          throw new TransactionError(
            'Insufficient funds. Please ensure you have at least 5 ADA in your wallet.',
            error
          );
        } else if (error.message.includes('User declined') || error.message.includes('canceled')) {
          throw new TransactionError(
            'Transaction was cancelled by the user.',
            error
          );
        } else if (error.message.includes('UTXOs') || error.message.includes('utxos')) {
          throw new TransactionError(
            'No UTXOs found. Please ensure your wallet has funds.',
            error
          );
        } else if (error.message.includes('Deserialization') || error.message.includes('Invalid internal structure')) {
          throw new TransactionError(
            'Wallet data format error. Please try disconnecting and reconnecting your wallet.',
            error
          );
        } else if (error.message.includes('hex string expected')) {
          throw new TransactionError(
            'Wallet data format error. Please try reconnecting your wallet.',
            error
          );
        }
      }
      
      throw new TransactionError(
        `Failed to create entity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error as Error
      );
    }
  }

  /**
   * Wait for transaction confirmation
   * @param txHash - Transaction hash to wait for
   */
  async waitForConfirmation(txHash: TxHash): Promise<void> {
    if (!this.lucid) {
      throw new EntityRegistryError('Blockchain not initialized');
    }

    try {
      console.log(`Waiting for transaction confirmation: ${txHash}`);
      
      // Set a longer timeout for testnet
      const timeoutMs = 300000; // 5 minutes
      const startTime = Date.now();
      
      // Use Promise.race to add our own timeout
      await Promise.race([
        this.lucid.awaitTx(txHash),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Transaction confirmation timeout after ${timeoutMs / 1000} seconds`));
          }, timeoutMs);
        })
      ]);
      
      const elapsedTime = Date.now() - startTime;
      console.log(`Transaction confirmed: ${txHash} (took ${elapsedTime}ms)`);
      
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          throw new TransactionError(
            `Transaction confirmation timed out. Transaction hash: ${txHash}. You can check the status manually on a Cardano block explorer.`,
            error
          );
        } else {
          throw new TransactionError(
            `Transaction failed to confirm: ${error.message}`,
            error
          );
        }
      } else {
        throw new TransactionError(
          'Transaction failed to confirm with unknown error',
          error as Error
        );
      }
    }
  }

  /**
   * Get the contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }

  /**
   * Check if blockchain is initialized and ready
   */
  isInitialized(): boolean {
    return this.lucid !== null;
  }

  /**
   * Get current wallet address
   */
  async getWalletAddress(): Promise<string> {
    if (!this.lucid) {
      throw new EntityRegistryError('Blockchain not initialized');
    }
    
    try {
      return await this.lucid.wallet().address();
    } catch (error) {
      throw new WalletConnectionError('Failed to get wallet address', error as Error);
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    this.lucid = null;
    console.log('Blockchain connection disconnected');
  }
}

// Factory function to create a configured instance
export function createEntityRegistry(config?: Partial<BlockchainConfig>): BrowserEntityRegistry {
  const defaultConfig: BlockchainConfig = {
    network: 'Preview',
    blockfrostUrl: 'https://cardano-preview.blockfrost.io/api/v0',
    blockfrostProjectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || '',
    ...config
  };

  if (!defaultConfig.blockfrostProjectId) {
    throw new EntityRegistryError(
      'Blockfrost project ID is required. Set NEXT_PUBLIC_BLOCKFROST_PROJECT_ID environment variable.'
    );
  }

  return new BrowserEntityRegistry(defaultConfig);
}

// Type assertion helper for wallet APIs
interface WalletApi {
  enable(): Promise<any>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}