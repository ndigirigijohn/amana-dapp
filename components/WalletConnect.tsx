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
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <div className="text-xs text-muted-foreground">
              {truncateAddress(connectedWallet.address)}
            </div>
            <div className="text-sm font-medium">
              {connectedWallet.balance.lovelace} ₳
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg flex items-center transition-colors"
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
          className="py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-background rounded-xl shadow-xl max-w-md w-full h-auto max-h-[90vh] overflow-y-auto mr-4 mt-20 animate-in fade-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (X) positioned absolutely in the top-right corner */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1.5 hover:bg-muted"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            
            <div className="p-5 pt-12 border-b">
              <h3 className="text-lg font-bold">
                {connectedWallet ? 'Wallet Connected' : 'Connect Wallet'}
              </h3>
            </div>
            
            <div className="p-5">
              {errorMessage && (
                <div className="mb-5 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-start">
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
                    <span className="font-medium">Wallet</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{connectedWallet.name}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium">Address</span>
                    <div className="bg-muted/50 p-3 rounded-lg text-sm break-all font-mono border">
                      {connectedWallet.address}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border space-y-1 text-center">
                      <span className="text-sm font-medium text-muted-foreground">Balance</span>
                      <p className="text-2xl font-bold">{connectedWallet.balance.lovelace} ₳</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border space-y-1 text-center">
                      <span className="text-sm font-medium text-muted-foreground">Assets</span>
                      <p className="text-2xl font-bold">{connectedWallet.balance.assets}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium mt-2"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-muted-foreground">
                    Select a wallet to connect to this application:
                  </p>
                  
                  {availableWallets.length === 0 ? (
                    <div className="py-10 text-center space-y-3">
                      <div className="bg-muted/50 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">No wallets found</p>
                      <p className="text-sm text-muted-foreground">Please install a Cardano wallet extension</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {availableWallets.map((wallet) => (
                        <button
                          key={wallet.name}
                          onClick={() => connectWallet(wallet.name)}
                          disabled={isConnecting}
                          className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group relative"
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
                            <div className="font-medium">{wallet.name}</div>
                            <div className="text-xs text-muted-foreground">Version {wallet.version}</div>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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