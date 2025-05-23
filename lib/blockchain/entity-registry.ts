// lib/blockchain/entity-registry.ts
import { Lucid, Blockfrost, TxHash } from '@lucid-evolution/lucid';
import { BrowserWallet } from '@meshsdk/core';
import { EntityRegistryClient } from '../../offchain/entity-registry/entity-registry-client';
import { loadValidators } from '../../offchain/utils/validators';

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
 * Integrates Mesh SDK wallet with Lucid Evolution and our EntityRegistryClient
 */
export class BrowserEntityRegistry {
  private config: BlockchainConfig;
  private lucid: any = null;
  private client: EntityRegistryClient | null = null;

  constructor(config: BlockchainConfig) {
    this.config = config;
  }

  /**
   * Initialize the blockchain connection with a connected wallet
   * @param walletName - Name of the wallet (from Mesh SDK)
   */
  async initialize(walletName: string): Promise<void> {
    try {
      // Connect to wallet using Mesh SDK
      const wallet = await BrowserWallet.enable(walletName);
      
      // Initialize Lucid with Blockfrost
      this.lucid = await Lucid(
        new Blockfrost(
          this.config.blockfrostUrl,
          this.config.blockfrostProjectId
        ),
        this.config.network
      );

      // Connect wallet to Lucid
      // The wallet from BrowserWallet.enable() is already the API we need
      this.lucid.selectWallet.fromAPI(wallet);

      // Load validators and create client
      const validators = loadValidators();
      this.client = new EntityRegistryClient(
        this.lucid,
        validators.entityRegistry.compiledCode,
        this.config.contractAddress
      );

      console.log('Blockchain connection initialized successfully');
      
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
    if (!this.client || !this.lucid) {
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
      
      // Create entity using our client
      const txHash = await this.client.createEntity(name.trim(), description.trim());
      
      // Generate a unique entity ID for frontend tracking
      const entityId = `entity-${Date.now()}-${txHash.slice(-8)}`;
      
      const result: CreateEntityResult = {
        txHash,
        contractAddress: this.client.getContractAddress(),
        entityId
      };

      console.log(`Entity creation transaction submitted:`, result);
      
      return result;
      
    } catch (error) {
      console.error('Entity creation failed:', error);
      throw new TransactionError(
        `Failed to create entity "${name}"`,
        error as Error
      );
    }
  }

  /**
   * Wait for transaction confirmation
   * @param txHash - Transaction hash to wait for
   */
  async waitForConfirmation(txHash: TxHash): Promise<void> {
    if (!this.client) {
      throw new EntityRegistryError('Blockchain not initialized');
    }

    try {
      await this.client.waitForConfirmation(txHash);
      console.log(`Transaction confirmed: ${txHash}`);
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      throw new TransactionError(
        'Transaction failed to confirm',
        error as Error
      );
    }
  }

  /**
   * Get the contract address
   */
  getContractAddress(): string {
    if (!this.client) {
      throw new EntityRegistryError('Blockchain not initialized');
    }
    return this.client.getContractAddress();
  }

  /**
   * Check if blockchain is initialized and ready
   */
  isInitialized(): boolean {
    return this.client !== null && this.lucid !== null;
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
    this.client = null;
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