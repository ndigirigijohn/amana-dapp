'use client';

import { useState, useEffect } from 'react';
import { BrowserWallet, type Asset, deserializeAddress } from '@meshsdk/core';
import { Wallet, Copy, ExternalLink, ChevronDown, Power, User, CreditCard, Zap } from 'lucide-react';

type WalletType = {
  name: string;
  icon: string;
  version: string;
}

type ConnectedWalletType = {
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
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatBalance = (lovelace: string): string => {
  const ada = parseFloat(lovelace);
  if (ada >= 1000000) return `${(ada / 1000000).toFixed(1)}M`;
  if (ada >= 1000) return `${(ada / 1000).toFixed(1)}K`;
  return ada.toFixed(2);
};

const WalletConnect = () => {
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWalletType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string>('');

  // Check for available wallets and saved connection on component mount
  useEffect(() => {
    const initialize = async () => {
      // Check for saved wallet connection
      const savedConnection = getSavedWalletConnection();
      if (savedConnection) {
        setConnectedWallet(savedConnection);
      }

      // Get available wallets
      try {
        const wallets = await BrowserWallet.getAvailableWallets();
        setAvailableWallets(wallets);
      } catch (error) {
        console.error('Error fetching available wallets:', error);
        setErrorMessage('Failed to load available wallets');
      }
    };

    initialize();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Retrieve saved wallet connection from local storage
  const getSavedWalletConnection = (): ConnectedWalletType | null => {
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
  const saveWalletConnection = (wallet: ConnectedWalletType) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    } catch (error) {
      console.error('Error saving wallet connection:', error);
    }
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Connect to wallet
  const connectWallet = async (walletName: string) => {
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      const wallet = await BrowserWallet.enable(walletName);
      const addresses = await wallet.getUsedAddresses();
      const firstAddress = addresses.length > 0 ? addresses[0] : (await wallet.getUnusedAddresses())[0];
      const { pubKeyHash } = deserializeAddress(firstAddress);
      
      let lovelace = "0";
      let assets: Asset[] = [];
      
      try {
        lovelace = await wallet.getLovelace();
      } catch (error) {
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
        assets = await wallet.getAssets();
      } catch (error) {
        try {
          const balance = await wallet.getBalance();
          assets = balance.filter(asset => asset.unit !== 'lovelace');
        } catch (balanceError) {
          console.error('Error fetching balance for assets:', balanceError);
        }
      }

      const walletInfo: ConnectedWalletType = {
        name: walletName,
        address: firstAddress,
        verificationKeyHash: pubKeyHash,
        balance: {
          lovelace: (parseInt(lovelace || "0") / 1000000).toFixed(2),
          assets: assets.length
        },
        lastConnected: Date.now()
      };

      setConnectedWallet(walletInfo);
      saveWalletConnection(walletInfo);
      setIsModalOpen(false);
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
    setIsDropdownOpen(false);
  };

  // Wallet button for different states
  const renderWalletButton = () => {
    if (connectedWallet) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center space-x-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-white">{formatBalance(connectedWallet.balance.lovelace)} ₳</div>
                <div className="text-xs text-gray-400">{truncateAddress(connectedWallet.address)}</div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-400">Connected</div>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Balance</div>
                    <div className="text-lg font-bold text-emerald-400">{connectedWallet.balance.lovelace} ₳</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">Assets</div>
                    <div className="text-lg font-bold text-cyan-400">{connectedWallet.balance.assets}</div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Wallet Address</div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm font-mono text-gray-300 flex-1 truncate">
                        {connectedWallet.address}
                      </div>
                      <button
                        onClick={() => copyToClipboard(connectedWallet.address, 'address')}
                        className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {copiedText === 'address' && (
                      <div className="text-xs text-emerald-400 mt-1">Address copied!</div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Verification Key Hash</div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm font-mono text-gray-300 flex-1 truncate">
                        {connectedWallet.verificationKeyHash}
                      </div>
                      <button
                        onClick={() => copyToClipboard(connectedWallet.verificationKeyHash, 'vkh')}
                        className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {copiedText === 'vkh' && (
                      <div className="text-xs text-emerald-400 mt-1">VKH copied!</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  <button
                    onClick={() => window.open(`https://preview.cardanoscan.io/address/${connectedWallet.address}`, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl py-2.5 transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Explorer</span>
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl py-2.5 transition-all duration-200"
                  >
                    <Power className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none flex items-center space-x-2"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {renderWalletButton()}

      {/* Connection Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
                    <p className="text-sm text-gray-400">Choose your preferred Cardano wallet</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <div className="w-5 h-5 text-gray-400">×</div>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start space-x-3">
                  <div className="w-5 h-5 text-red-400 mt-0.5">⚠</div>
                  <div>{errorMessage}</div>
                </div>
              )}

              {availableWallets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No Wallets Found</h4>
                  <p className="text-sm text-gray-400 mb-6">Please install a Cardano wallet extension to continue</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: 'Eternl', url: 'https://eternl.io' },
                      { name: 'Nami', url: 'https://namiwallet.io' },
                      { name: 'Lace', url: 'https://www.lace.io' },
                    ].map((wallet) => (
                      <a
                        key={wallet.name}
                        href={wallet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 rounded-xl transition-all duration-200"
                      >
                        <span className="text-white font-medium">Install {wallet.name}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Select a wallet to connect:</p>
                  
                  {availableWallets.map((wallet) => (
                    <button
                      key={wallet.name}
                      onClick={() => connectWallet(wallet.name)}
                      disabled={isConnecting}
                      className="w-full flex items-center space-x-4 p-4 bg-gray-800/30 hover:bg-gray-800/60 disabled:bg-gray-800/20 border border-gray-700 hover:border-emerald-500/50 disabled:border-gray-700 rounded-xl transition-all duration-200 group"
                    >
                      {wallet.icon && (
                        <div className="w-12 h-12 flex-shrink-0">
                          <img 
                            src={wallet.icon} 
                            alt={`${wallet.name} icon`} 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                          {wallet.name}
                        </div>
                        <div className="text-xs text-gray-400">Version {wallet.version}</div>
                      </div>
                      <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletConnect; 