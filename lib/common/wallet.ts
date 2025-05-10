// lib/common/wallet.ts
import { BrowserWallet, type Asset, deserializeAddress } from '@meshsdk/core';

// Types
export type WalletInfo = {
  name: string;
  icon: string;
  version: string;
}

export type ConnectedWalletInfo = {
  name: string;
  address: string;
  verificationKeyHash: string;
  balance: {
    lovelace: string;
    assets: number;
  };
  lastConnected: number; // Timestamp
}

// Constants
const STORAGE_KEY = 'amana_wallet_connection';

// Helper functions
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
};

export const truncateVKH = (vkh: string): string => {
  if (!vkh) return '';
  return `${vkh.substring(0, 8)}...${vkh.substring(vkh.length - 8)}`;
};

// Core wallet functions
export const getAvailableWallets = async (): Promise<WalletInfo[]> => {
  try {
    return await BrowserWallet.getAvailableWallets();
  } catch (error) {
    console.error('Error fetching available wallets:', error);
    throw new Error('Failed to get available wallets');
  }
};

export const connectWallet = async (walletName: string): Promise<ConnectedWalletInfo> => {
  try {
    // Enable the wallet
    const wallet = await BrowserWallet.enable(walletName);
    
    // Get wallet address
    const addresses = await wallet.getUsedAddresses();
    const firstAddress = addresses.length > 0 
      ? addresses[0] 
      : (await wallet.getUnusedAddresses())[0];
    
    // Get verification key hash
    const { pubKeyHash } = deserializeAddress(firstAddress);
    
    // Get wallet balance info
    let lovelace = "0";
    let assets: Asset[] = [];
    
    try {
      // Get lovelace balance (primary approach)
      lovelace = await wallet.getLovelace();
    } catch (error) {
      console.error('Error fetching lovelace:', error);
      
      // Fallback approach
      try {
        const balance = await wallet.getBalance();
        const lovelaceAsset = balance.find(asset => asset.unit === 'lovelace');
        if (lovelaceAsset) {
          lovelace = lovelaceAsset.quantity;
        }
      } catch (balanceError) {
        console.error('Error fetching balance:', balanceError);
      }
    }
    
    try {
      // Get other assets (primary approach)
      assets = await wallet.getAssets();
    } catch (error) {
      console.error('Error fetching assets:', error);
      
      // Fallback approach
      try {
        const balance = await wallet.getBalance();
        assets = balance.filter(asset => asset.unit !== 'lovelace');
      } catch (balanceError) {
        console.error('Error fetching balance for assets:', balanceError);
      }
    }

    // Create wallet info object
    const walletInfo: ConnectedWalletInfo = {
      name: walletName,
      address: firstAddress,
      verificationKeyHash: pubKeyHash,
      balance: {
        lovelace: (parseInt(lovelace || "0") / 1000000).toFixed(2), // Convert to ADA
        assets: assets.length
      },
      lastConnected: Date.now()
    };

    // Save to local storage
    saveWalletConnection(walletInfo);
    
    return walletInfo;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

export const disconnectWallet = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const saveWalletConnection = (walletInfo: ConnectedWalletInfo): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(walletInfo));
};

export const getSavedWalletConnection = (): ConnectedWalletInfo | null => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return null;
  
  try {
    return JSON.parse(savedData) as ConnectedWalletInfo;
  } catch (error) {
    console.error('Error parsing saved wallet data:', error);
    return null;
  }
};

// Wallet state management helpers
export const refreshWalletData = async (walletName: string): Promise<ConnectedWalletInfo | null> => {
  try {
    const walletInfo = await connectWallet(walletName);
    return walletInfo;
  } catch (error) {
    console.error('Error refreshing wallet data:', error);
    return null;
  }
};