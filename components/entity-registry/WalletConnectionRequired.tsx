'use client';

import { ArrowRight, Wallet, Shield, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WalletConnectionRequired() {
  // Show modal to connect wallet when clicked
  const handleConnectClick = () => {
    // Create and dispatch a custom event that the WalletConnect component can listen for
    const event = new CustomEvent('openWalletModal');
    window.dispatchEvent(event);
  };
  
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-60"></div>
      
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
        {/* Main Content */}
        <div className="p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mx-auto bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 rounded-3xl w-24 h-24 flex items-center justify-center mb-8">
            <Wallet className="h-12 w-12 text-white" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Connect Your Wallet
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Use the "Connect Wallet" button in the top right to get started
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10 max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-sm text-gray-300">Secure</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-sm text-gray-300">Fast</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-sm text-gray-300">Private</div>
            </div>
          </div>
          
          {/* Note: Connect button removed - users should use the header button */}
          
          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            No wallet? Popular options include Lace, Eternl, and Nami.
          </p>
        </div>
      </div>
    </div>
  );
}