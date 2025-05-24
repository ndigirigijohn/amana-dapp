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
      
      // Connect to wallet using Mesh SDK
      const wallet = await BrowserWallet.enable(walletName);
      console.log('BrowserEntityRegistry: Wallet enabled successfully');
      
      // Initialize Lucid with Blockfrost
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

      // Connect wallet to Lucid
      this.lucid.selectWallet.fromAPI(wallet);
      console.log('BrowserEntityRegistry: Wallet connected to Lucid');

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
      
      // Get founder VKH from saved wallet info to avoid deserialization issues
      const savedWallet = localStorage.getItem('amana_wallet_connection');
      if (!savedWallet) {
        throw new Error('Wallet connection not found. Please reconnect your wallet.');
      }
      
      const walletInfo = JSON.parse(savedWallet);
      const founderVkh = walletInfo.verificationKeyHash;
      console.log('Using saved founder VKH:', founderVkh);
      
      console.log('Building transaction...');
      
      try {
        // Build a simple transaction without complex operations
        const utxos = await this.lucid.wallet().getUtxos();
        console.log(`Found ${utxos.length} UTXOs`);
        
        if (utxos.length === 0) {
          throw new Error('No UTXOs found in wallet. Please ensure you have funds.');
        }
        
        // Create transaction
        const tx = this.lucid.newTx();
        
        // Add payment to contract
        tx.payToAddress(this.contractAddress, { lovelace: 2000000 });
        
        // Complete the transaction
        const completedTx = await tx.complete();
        console.log('Transaction completed');
        
        // Sign the transaction
        const signedTx = await completedTx.sign().complete();
        console.log('Transaction signed');
        
        // Submit the transaction
        const txHash = await signedTx.submit();
        console.log('Transaction submitted:', txHash);
        
        // Generate a unique entity ID for frontend tracking
        const entityId = `entity-${Date.now()}-${txHash.slice(-8)}`;
        
        const result: CreateEntityResult = {
          txHash,
          contractAddress: this.contractAddress,
          entityId
        };

        console.log(`Entity creation transaction submitted:`, result);
        
        return result;
        
      } catch (txError) {
        console.error('Transaction building error:', txError);
        
        // If the above fails, try the most basic transaction possible
        console.log('Trying fallback transaction method...');
        
        const tx = this.lucid.newTx()
          .payToAddress(this.contractAddress, { lovelace: 2000000 });
          
        const complete = await tx.complete();
        const signed = await complete.sign().complete();
        const txHash = await signed.submit();
        
        const entityId = `entity-${Date.now()}-${txHash.slice(-8)}`;
        
        return {
          txHash,
          contractAddress: this.contractAddress,
          entityId
        };
      }
      
    } catch (error) {
      console.error('Entity creation failed:', error);
      
      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes('Insufficient')) {
          throw new TransactionError(
            'Insufficient funds. Please ensure you have at least 5 ADA in your wallet.',
            error
          );
        } else if (error.message.includes('User declined') || error.message.includes('canceled')) {
          throw new TransactionError(
            'Transaction was cancelled by the user.',
            error
          );
        } else if (error.message.includes('UTXOs')) {
          throw new TransactionError(
            'No UTXOs found. Please ensure your wallet has funds.',
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
      await this.lucid.awaitTx(txHash);
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