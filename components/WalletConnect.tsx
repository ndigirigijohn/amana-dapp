'use client';

import { useState, useEffect } from 'react';
import { BrowserWallet, type Asset, deserializeAddress } from '@meshsdk/core';

type Wallet = {
  name: string;
  icon: string;
  version: string;
}

type ConnectedWallet = {
  name: string;
  address: string;
  verificationKeyHash: string;
  balance: {
    lovelace: string;
    assets: number;
  };
  lastConnected: number;
}

const STORAGE_KEY = 'amana_wallet_connection';

// Helper functions
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
};

const WalletConnect = () => {
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for available wallets and saved connection on component mount
  useEffect(() => {
    const initialize = async () => {
      // Check for saved wallet connection
      const savedConnection = getSavedWalletConnection();
      if (savedConnection) {
        console.log("Found saved wallet connection:", savedConnection.name);
        setConnectedWallet(savedConnection);
      }

      // Get available wallets
      try {
        const wallets = await BrowserWallet.getAvailableWallets();
        console.log("Available wallets:", wallets);
        setAvailableWallets(wallets);
      } catch (error) {
        console.error('Error fetching available wallets:', error);
        setErrorMessage('Failed to load available wallets');
      }
    };

    initialize();
  }, []);

  // Retrieve saved wallet connection from local storage
  const getSavedWalletConnection = (): ConnectedWallet | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return null;
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error reading saved wallet data:', error);
      return null;
    }
  };

  // Save wallet connection to local storage
  const saveWalletConnection = (wallet: ConnectedWallet) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    } catch (error) {
      console.error('Error saving wallet connection:', error);
    }
  };

  // Connect to wallet
  const connectWallet = async (walletName: string) => {
    console.log(`Attempting to connect to wallet: ${walletName}`);
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      // 1. Enable the wallet
      const wallet = await BrowserWallet.enable(walletName);
      
      // 2. Get wallet address
      const addresses = await wallet.getUsedAddresses();
      const firstAddress = addresses.length > 0 ? addresses[0] : (await wallet.getUnusedAddresses())[0];
      
      // 3. Get verification key hash
      const { pubKeyHash } = deserializeAddress(firstAddress);
      console.log('Verification Key Hash:', pubKeyHash);
      
      // 4. Get wallet balance information
      let lovelace = "0";
      let assets: Asset[] = [];
      
      try {
        // Try to get ADA balance
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
        // Try to get assets
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

      // 5. Create wallet info object
      const walletInfo: ConnectedWallet = {
        name: walletName,
        address: firstAddress,
        verificationKeyHash: pubKeyHash,
        balance: {
          lovelace: (parseInt(lovelace || "0") / 1000000).toFixed(2), // Convert to ADA
          assets: assets.length
        },
        lastConnected: Date.now()
      };

      // 6. Update state and save
      setConnectedWallet(walletInfo);
      saveWalletConnection(walletInfo);
      
      // 7. Close modal
      setIsModalOpen(false);
      console.log('Wallet connected successfully:', walletInfo);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setErrorMessage(`Failed to connect to ${walletName}. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setConnectedWallet(null);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Wallet disconnected');
  };

  return (
    <div className="relative">
      {/* Connect/Disconnect Button */}
      {connectedWallet ? (
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <div className="text-xs text-gray-400">
              {truncateAddress(connectedWallet.address)}
            </div>
            <div className="text-sm font-medium text-white">
              {connectedWallet.balance.lovelace} ₳
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl flex items-center transition-colors border border-emerald-500/30 hover:border-emerald-500/50"
            aria-label="Wallet details"
          >
            <span className="mr-1.5 hidden sm:inline font-medium">{connectedWallet.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.53 5.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H5a.75.75 0 0 1 0-1.5h8.75l-3.22-3.22a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-emerald-500/25"
          disabled={isConnecting}
          aria-label="Connect wallet"
        >
          {isConnecting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </div>
          ) : "Connect Wallet"}
        </button>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-end z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full h-auto max-h-[90vh] overflow-y-auto mr-4 mt-20 animate-in fade-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (X) positioned absolutely in the top-right corner */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors rounded-full p-1.5 hover:bg-gray-800"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            
            <div className="p-5 pt-12 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">
                {connectedWallet ? 'Wallet Connected' : 'Connect Wallet'}
              </h3>
            </div>
            
            <div className="p-5">
              {errorMessage && (
                <div className="mb-5 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm flex items-start border border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {connectedWallet ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Wallet</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">{connectedWallet.name}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="font-medium text-white">Address</span>
                    <div className="bg-gray-800 p-3 rounded-lg text-sm break-all font-mono border border-gray-700 text-gray-300">
                      {connectedWallet.address}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="font-medium text-white">Verification Key Hash</span>
                    <div className="bg-gray-800 p-3 rounded-lg text-sm break-all font-mono border border-gray-700 text-gray-300">
                      {connectedWallet.verificationKeyHash}
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(connectedWallet.verificationKeyHash);
                          alert("Verification Key Hash copied to clipboard!");
                        }}
                        className="text-emerald-400 text-xs flex items-center hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Copy to clipboard
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-1 text-center">
                      <span className="text-sm font-medium text-gray-400">Balance</span>
                      <p className="text-2xl font-bold text-emerald-400">{connectedWallet.balance.lovelace} ₳</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-1 text-center">
                      <span className="text-sm font-medium text-gray-400">Assets</span>
                      <p className="text-2xl font-bold text-cyan-400">{connectedWallet.balance.assets}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium mt-2 border border-red-500/30 hover:border-red-500/50"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-gray-400">
                    Select a wallet to connect to this application:
                  </p>
                  
                  {availableWallets.length === 0 ? (
                    <div className="py-10 text-center space-y-3">
                      <div className="bg-gray-800 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <p className="text-gray-400">No wallets found</p>
                      <p className="text-sm text-gray-500">Please install a Cardano wallet extension</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {availableWallets.map((wallet) => (
                        <button
                          key={wallet.name}
                          onClick={() => connectWallet(wallet.name)}
                          disabled={isConnecting}
                          className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-emerald-500/50 transition-colors group relative"
                        >
                          {wallet.icon && (
                            <div className="h-10 w-10 mr-3 flex-shrink-0">
                              <img 
                                src={wallet.icon} 
                                alt={`${wallet.name} icon`} 
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-medium text-white">{wallet.name}</div>
                            <div className="text-xs text-gray-400">Version {wallet.version}</div>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;