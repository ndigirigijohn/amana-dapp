'use client';

import { useState, useEffect } from 'react';
import { BrowserWallet, type Asset } from '@meshsdk/core';

type Wallet = {
  name: string;
  icon: string;
  version: string;
}

type ConnectedWallet = {
  name: string;
  address: string;
  balance: {
    lovelace: string;
    assets: number;
  };
}

const WalletConnect = () => {
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [walletInstance, setWalletInstance] = useState<any>(null);

  // Check for available wallets on component mount
  useEffect(() => {
    const getWallets = async () => {
      try {
        const wallets = await BrowserWallet.getAvailableWallets();
        setAvailableWallets(wallets);
      } catch (error) {
        console.error('Error fetching available wallets:', error);
        setErrorMessage('Failed to load available wallets');
      }
    };

    getWallets();

    // Check for persisted wallet connection
    const checkPersistedConnection = async () => {
      const savedWalletName = localStorage.getItem('connectedWalletName');
      if (savedWalletName) {
        try {
          await connectWallet(savedWalletName);
        } catch (error) {
          console.error('Failed to reconnect to saved wallet:', error);
          localStorage.removeItem('connectedWalletName');
        }
      }
    };

    checkPersistedConnection();
  }, []);

  const connectWallet = async (walletName: string) => {
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      const wallet = await BrowserWallet.enable(walletName);

      console.log("Wallet", wallet);
      setWalletInstance(wallet);
      
      // Get wallet data to display
      const addresses = await wallet.getUsedAddresses();
      const firstAddress = addresses.length > 0 ? addresses[0] : (await wallet.getUnusedAddresses())[0];
      
      let lovelace = "0";
      let assets: Asset[] = [];
      
      try {
        // Get lovelace balance
        lovelace = await wallet.getLovelace();
      } catch (error) {
        console.error('Error fetching lovelace:', error);
        
        // Alternative approach if getLovelace fails
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
        // Get assets
        assets = await wallet.getAssets();
      } catch (error) {
        console.error('Error fetching assets:', error);
        
        // Alternative approach if getAssets fails
        try {
          const balance = await wallet.getBalance();
          assets = balance.filter(asset => asset.unit !== 'lovelace');
        } catch (balanceError) {
          console.error('Error fetching balance for assets:', balanceError);
        }
      }

      setConnectedWallet({
        name: walletName,
        address: firstAddress,
        balance: {
          lovelace: (parseInt(lovelace || "0") / 1000000).toFixed(2), // Convert to ADA
          assets: assets.length
        }
      });

      // Log some wallet info
      console.log('Connected to wallet:', walletName);
      console.log('Wallet address:', firstAddress);
      console.log('Balance:', (parseInt(lovelace || "0") / 1000000).toFixed(2), 'ADA');
      console.log('Assets:', assets.length);
      
      // Save connection
      localStorage.setItem('connectedWalletName', walletName);
      
      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setErrorMessage(`Failed to connect to ${walletName}. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setWalletInstance(null);
    localStorage.removeItem('connectedWalletName');
    console.log('Wallet disconnected');
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="relative">
      {/* Connect/Disconnect Button */}
      {connectedWallet ? (
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <div className="text-xs text-gray-500">
              {truncateAddress(connectedWallet.address)}
            </div>
            <div className="text-sm font-semibold">
              {connectedWallet.balance.lovelace} ₳
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center transition-colors"
          >
            <span className="mr-1 hidden sm:inline">{connectedWallet.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {connectedWallet ? 'Wallet Connected' : 'Connect Wallet'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}

              {connectedWallet ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Wallet:</span>
                    <span>{connectedWallet.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-sm break-all mt-1 bg-gray-50 p-2 rounded">{connectedWallet.address}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Balance:</span>
                    <span>{connectedWallet.balance.lovelace} ₳</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Assets:</span>
                    <span>{connectedWallet.balance.assets}</span>
                  </div>
                  
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Select a wallet to connect to this application:
                  </p>
                  
                  {availableWallets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No wallets found. Please install a Cardano wallet extension.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableWallets.map((wallet) => (
                        <button
                          key={wallet.name}
                          onClick={() => connectWallet(wallet.name)}
                          disabled={isConnecting}
                          className="flex items-center justify-center border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          {wallet.icon && (
                            <img 
                              src={wallet.icon} 
                              alt={`${wallet.name} icon`} 
                              className="h-8 w-8 mr-2"
                            />
                          )}
                          <span>{wallet.name}</span>
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