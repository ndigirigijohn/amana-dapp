// hooks/useEntityRegistry.ts
import { useState, useCallback, useRef } from 'react';
import { 
  BrowserEntityRegistry, 
  createEntityRegistry, 
  CreateEntityResult,
  EntityRegistryError,
  WalletConnectionError,
  TransactionError
} from '@/lib/blockchain/entity-registry';
import { getSavedWalletConnection } from '@/lib/common';

export interface UseEntityRegistryReturn {
  // State
  isInitialized: boolean;
  isInitializing: boolean;
  isCreatingEntity: boolean;
  isWaitingForConfirmation: boolean;
  error: string | null;
  lastTransaction: CreateEntityResult | null;
  
  // Actions
  initializeRegistry: () => Promise<boolean>;
  createEntity: (name: string, description: string) => Promise<CreateEntityResult | null>;
  waitForConfirmation: (txHash: string) => Promise<boolean>;
  clearError: () => void;
}

export function useEntityRegistry(): UseEntityRegistryReturn {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCreatingEntity, setIsCreatingEntity] = useState(false);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<CreateEntityResult | null>(null);
  
  // Registry instance ref
  const registryRef = useRef<BrowserEntityRegistry | null>(null);

  // Initialize the blockchain connection
  const initializeRegistry = useCallback(async (): Promise<boolean> => {
    if (isInitialized) {
      console.log('Registry already initialized');
      return true;
    }

    if (isInitializing) {
      console.log('Registry initialization already in progress');
      return false;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Get wallet connection info
      const walletConnection = getSavedWalletConnection();
      if (!walletConnection) {
        throw new Error('No wallet connected. Please connect your wallet first.');
      }

      console.log('Wallet connection found:', walletConnection.name);

      // Check for Blockfrost API key
      const blockfrostProjectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
      if (!blockfrostProjectId) {
        throw new Error('Blockfrost API key not found. Please add NEXT_PUBLIC_BLOCKFROST_PROJECT_ID to your .env.local file');
      }

      console.log('Blockfrost project ID found');

      // Create registry instance
      if (!registryRef.current) {
        registryRef.current = createEntityRegistry({
          network: 'Preview',
          blockfrostProjectId: blockfrostProjectId,
        });
      }

      console.log('Registry instance created, initializing with wallet:', walletConnection.name);

      // Initialize with connected wallet
      await registryRef.current.initialize(walletConnection.name);
      
      setIsInitialized(true);
      console.log('Entity registry initialized successfully');
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize registry';
      console.error('Registry initialization error:', err);
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('Blockfrost')) {
          setError('Blockchain connection failed. Please check your Blockfrost API key.');
        } else if (err.message.includes('wallet')) {
          setError('Wallet connection failed. Please try reconnecting your wallet.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized, isInitializing]);

  // Create a new entity
  const createEntity = useCallback(async (
    name: string, 
    description: string
  ): Promise<CreateEntityResult | null> => {
    console.log('useEntityRegistry: createEntity called with:', { name, description });
    
    // Ensure registry is initialized
    if (!isInitialized || !registryRef.current) {
      console.log('useEntityRegistry: Registry not initialized, initializing now...');
      const initialized = await initializeRegistry();
      if (!initialized) {
        console.error('useEntityRegistry: Failed to initialize registry');
        setError('Failed to initialize blockchain connection. Please try again.');
        return null;
      }
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!registryRef.current) {
      console.error('useEntityRegistry: Registry still not available after initialization');
      setError('Registry not available. Please try again.');
      return null;
    }

    setIsCreatingEntity(true);
    setError(null);

    try {
      console.log('useEntityRegistry: Calling registry.createEntity...');
      const result = await registryRef.current.createEntity(name, description);
      
      console.log('useEntityRegistry: Entity created successfully:', result);
      setLastTransaction(result);
      return result;
      
    } catch (err) {
      console.error('useEntityRegistry: createEntity error:', err);
      
      let errorMessage = 'Failed to create entity';
      
      if (err instanceof WalletConnectionError) {
        errorMessage = 'Wallet connection error: ' + err.message;
      } else if (err instanceof TransactionError) {
        errorMessage = err.message;
      } else if (err instanceof EntityRegistryError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('useEntityRegistry: Setting error message:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsCreatingEntity(false);
    }
  }, [isInitialized, initializeRegistry]);
  

  // Wait for transaction confirmation
  const waitForConfirmation = useCallback(async (txHash: string): Promise<boolean> => {
    // Ensure registry is available
    if (!registryRef.current) {
      console.error('Registry not available for confirmation');
      setError('Registry not available for confirmation');
      return false;
    }

    setIsWaitingForConfirmation(true);
    setError(null);

    try {
      console.log('Waiting for transaction confirmation:', txHash);
      await registryRef.current.waitForConfirmation(txHash);
      console.log('Transaction confirmed successfully:', txHash);
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction confirmation failed';
      console.error('Confirmation error:', err);
      
      // More specific error handling for confirmation failures
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('Timeout')) {
          setError('Transaction confirmation timed out. Your transaction may still be processing on the blockchain.');
        } else if (err.message.includes('rejected') || err.message.includes('failed')) {
          setError('Transaction was rejected by the network. Please check your transaction and try again.');
        } else {
          setError(`Transaction confirmation failed: ${errorMessage}`);
        }
      } else {
        setError('Transaction confirmation failed with an unknown error');
      }
      
      return false;
    } finally {
      setIsWaitingForConfirmation(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isInitialized,
    isInitializing,
    isCreatingEntity,
    isWaitingForConfirmation,
    error,
    lastTransaction,
    
    // Actions
    initializeRegistry,
    createEntity,
    waitForConfirmation,
    clearError,
  };
}