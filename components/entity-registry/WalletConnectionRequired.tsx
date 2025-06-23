'use client';

import { ArrowRight, Wallet, ExternalLink, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WalletConnectionRequired() {
  // Show modal to connect wallet when clicked
  const handleConnectClick = () => {
    // Find the wallet connect button in the header and click it
    const connectButton = document.querySelector('[aria-label="Connect wallet"]') as HTMLButtonElement;
    if (connectButton) {
      connectButton.click();
    }
  };
  
  const wallets = [
    {
      name: 'Eternl Wallet',
      url: 'https://eternl.io/app/mainnet/welcome',
      icon: '🔮',
      description: 'Feature-rich wallet with advanced capabilities'
    },
    {
      name: 'Nami Wallet',
      url: 'https://namiwallet.io/',
      icon: '🌊',
      description: 'Simple and intuitive Cardano wallet'
    },
    {
      name: 'Lace Wallet',
      url: 'https://www.lace.io/',
      icon: '✨',
      description: 'Next-generation Cardano wallet by IOG'
    }
  ];
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-white/10">
        <div className="mx-auto bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Wallet Connection Required
          </span>
        </CardTitle>
        <CardDescription className="text-lg text-gray-300 max-w-2xl mx-auto">
          Connect your Cardano wallet to create or restore an entity on the blockchain
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-emerald-500/20">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Secure • Fast • Decentralized</span>
          </div>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            To use the Amana CE platform, you need to connect a Cardano wallet. This allows you to 
            interact with the blockchain and manage your SACCO entity with complete security and transparency.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Don't have a wallet? Choose one to install:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wallets.map((wallet, index) => (
              <a
                key={index}
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-center">
                    <div className="text-3xl mb-3">{wallet.icon}</div>
                    <h4 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {wallet.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {wallet.description}
                    </p>
                    <div className="flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      <span className="text-sm font-medium mr-2">Install</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <h4 className="font-semibold text-emerald-400 mb-2">Why Connect a Wallet?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                🔒
              </div>
              <span>Secure transactions</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2">
                🌐
              </div>
              <span>Blockchain interaction</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                👤
              </div>
              <span>Identity verification</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center p-8 border-t border-white/10">
        <Button 
          size="lg" 
          onClick={handleConnectClick} 
          className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
        >
          Connect Wallet
          <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </div>
  );
}