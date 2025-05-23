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

// Hook state interface
interface EntityRegistryState {
  isInitialized: boolean;
  isInitializing: boolean;
  isCreatingEntity: boolean;
  isWaitingForConfirmation: boolean;
  error: string | null;
  lastTransaction: CreateEntityResult | null;
}

// Hook return interface
interface UseEntityRegistryReturn extends EntityRegistryState {
  // Actions
  initializeRegistry: () => Promise<boolean>;
  createEntity: (name: string, description: string) => Promise<CreateEntityResult | null>;
  waitForConfirmation: (txHash: string) => Promise<boolean>;
  clearError: () => void;
  disconnect: () => void;
  
  // Utilities
  getContractAddress: () => string | null;
  getWalletAddress: () => Promise<string | null>;
}

/**
 * React hook for Entity Registry operations
 * Manages blockchain connection state and provides easy-to-use methods
 */
export function useEntityRegistry(): UseEntityRegistryReturn {
  // State management
  const [state, setState] = useState<EntityRegistryState>({
    isInitialized: false,
    isInitializing: false,
    isCreatingEntity: false,
    isWaitingForConfirmation: false,
    error: null,
    lastTransaction: null,
  });

  // Registry instance (persisted between renders)
  const registryRef = useRef<BrowserEntityRegistry | null>(null);

  // Helper to update state
  const updateState = useCallback((updates: Partial<EntityRegistryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Helper to handle errors
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Entity Registry Error (${context}):`, error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof WalletConnectionError) {
      errorMessage = `Wallet connection failed: ${error.message}`;
    } else if (error instanceof TransactionError) {
      errorMessage = `Transaction failed: ${error.message}`;
    } else if (error instanceof EntityRegistryError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    updateState({ error: errorMessage });
    return false;
  }, [updateState]);

  // Initialize the registry with connected wallet
  const initializeRegistry = useCallback(async (): Promise<boolean> => {
    if (state.isInitializing || state.isInitialized) {
      return state.isInitialized;
    }

    updateState({ isInitializing: true, error: null });

    try {
      // Get saved wallet connection
      const walletConnection = getSavedWalletConnection();
      if (!walletConnection) {
        throw new Error('No wallet connected. Please connect your wallet first.');
      }

      // Create registry instance if it doesn't exist
      if (!registryRef.current) {
        registryRef.current = createEntityRegistry();
      }

      // Initialize with the connected wallet
      await registryRef.current.initialize(walletConnection.name);

      updateState({ 
        isInitialized: true,
        isInitializing: false,
        error: null 
      });

      console.log('Entity Registry initialized successfully');
      return true;

    } catch (error) {
      updateState({ isInitializing: false });
      return handleError(error, 'initialization');
    }
  }, [state.isInitializing, state.isInitialized, updateState, handleError]);

  // Create a new entity
  const createEntity = useCallback(async (
    name: string, 
    description: string
  ): Promise<CreateEntityResult | null> => {
    if (state.isCreatingEntity) {
      return null;
    }

    // Ensure registry is initialized
    if (!state.isInitialized) {
      const initialized = await initializeRegistry();
      if (!initialized) {
        return null;
      }
    }

    updateState({ isCreatingEntity: true, error: null });

    try {
      if (!registryRef.current) {
        throw new Error('Registry not initialized');
      }

      const result = await registryRef.current.createEntity(name, description);
      
      updateState({ 
        isCreatingEntity: false,
        lastTransaction: result,
        error: null 
      });

      console.log('Entity created successfully:', result);
      return result;

    } catch (error) {
      updateState({ isCreatingEntity: false });
      handleError(error, 'entity creation');
      return null;
    }
  }, [state.isInitialized, state.isCreatingEntity, initializeRegistry, updateState, handleError]);

  // Wait for transaction confirmation
  const waitForConfirmation = useCallback(async (txHash: string): Promise<boolean> => {
    if (state.isWaitingForConfirmation) {
      return false;
    }

    updateState({ isWaitingForConfirmation: true, error: null });

    try {
      if (!registryRef.current) {
        throw new Error('Registry not initialized');
      }

      await registryRef.current.waitForConfirmation(txHash);
      
      updateState({ 
        isWaitingForConfirmation: false,
        error: null 
      });

      console.log('Transaction confirmed:', txHash);
      return true;

    } catch (error) {
      updateState({ isWaitingForConfirmation: false });
      return handleError(error, 'transaction confirmation');
    }
  }, [state.isWaitingForConfirmation, updateState, handleError]);

  // Get contract address
  const getContractAddress = useCallback((): string | null => {
    try {
      return registryRef.current?.getContractAddress() || null;
    } catch (error) {
      console.error('Failed to get contract address:', error);
      return null;
    }
  }, []);

  // Get wallet address
  const getWalletAddress = useCallback(async (): Promise<string | null> => {
    try {
      return await registryRef.current?.getWalletAddress() || null;
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      return null;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Disconnect and cleanup
  const disconnect = useCallback(() => {
    if (registryRef.current) {
      registryRef.current.disconnect();
      registryRef.current = null;
    }
    
    setState({
      isInitialized: false,
      isInitializing: false,
      isCreatingEntity: false,
      isWaitingForConfirmation: false,
      error: null,
      lastTransaction: null,
    });

    console.log('Entity Registry disconnected');
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    initializeRegistry,
    createEntity,
    waitForConfirmation,
    clearError,
    disconnect,
    
    // Utilities
    getContractAddress,
    getWalletAddress,
  };
}