// Simple utility functions for wallet operations
// These are used alongside the main WalletConnect component

import { deserializeAddress } from '@meshsdk/core';

// Types
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

// Storage key for wallet connection info
export const WALLET_STORAGE_KEY = 'amana_wallet_connection';

// Helper Functions
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
};

export const truncateVKH = (vkh: string): string => {
  if (!vkh) return '';
  return `${vkh.substring(0, 8)}...${vkh.substring(vkh.length - 8)}`;
};

export const getVerificationKeyHash = (address: string): string => {
  try {
    const { pubKeyHash } = deserializeAddress(address);
    return pubKeyHash;
  } catch (error) {
    console.error('Error getting verification key hash:', error);
    return '';
  }
};

// Local storage functions
export const saveWalletConnection = (wallet: ConnectedWalletInfo): void => {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    console.log('Wallet connection saved to local storage');
  } catch (error) {
    console.error('Error saving wallet connection:', error);
  }
};

export const getSavedWalletConnection = (): ConnectedWalletInfo | null => {
  try {
    const savedData = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!savedData) return null;
    const walletInfo = JSON.parse(savedData) as ConnectedWalletInfo;
    console.log('Retrieved saved wallet connection for:', walletInfo.name);
    return walletInfo;
  } catch (error) {
    console.error('Error retrieving saved wallet connection:', error);
    return null;
  }
};

export const clearSavedWalletConnection = (): void => {
  try {
    localStorage.removeItem(WALLET_STORAGE_KEY);
    console.log('Cleared saved wallet connection');
  } catch (error) {
    console.error('Error clearing saved wallet connection:', error);
  }
};