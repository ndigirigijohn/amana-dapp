'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import { getSavedWalletConnection } from '@/lib/common';
import EntityRegistrationForm from '@/components/entity-registry/EntityRegistrationForm';
import EntityRestoreForm from '@/components/entity-registry/EntityRestoreForm';
import WalletConnectionRequired from '@/components/entity-registry/WalletConnectionRequired';

export default function EntityRegistryPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'restore'>('create');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Check if wallet is connected on component mount and when localStorage changes
  useEffect(() => {
    const checkWalletConnection = () => {
      const savedWallet = getSavedWalletConnection();
      setIsWalletConnected(!!savedWallet);
    };
    
    // Check initially
    checkWalletConnection();
    
    // Set up a listener for localStorage changes
    const handleStorageChange = () => {
      checkWalletConnection();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll periodically since window.storage only fires for changes from other tabs
    const interval = setInterval(checkWalletConnection, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Geometric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] border border-white/5 rounded-full"></div>
          <div className="absolute inset-8 border border-white/10 rounded-full"></div>
          <div className="absolute inset-16 border border-emerald-500/20 rounded-full"></div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
              <span className="inline-block font-bold tracking-tight">Amana CE</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative z-10 py-8 px-4 md:px-6">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Entity Registry
              </span>
            </h1>
            
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Create or restore your SACCO entity on the Cardano blockchain
            </p>
          </div>

          {isWalletConnected ? (
            <div className="relative">
              {/* Glow effect behind tabs */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'create' | 'restore')}>
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-1">
                    <TabsTrigger 
                      value="create" 
                      className="rounded-xl text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-medium transition-all duration-300"
                    >
                      Create New Entity
                    </TabsTrigger>
                    <TabsTrigger 
                      value="restore"
                      className="rounded-xl text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-medium transition-all duration-300"
                    >
                      Restore Entity
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create">
                    <EntityRegistrationForm />
                  </TabsContent>
                  
                  <TabsContent value="restore">
                    <EntityRestoreForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Glow effect behind wallet connection */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
              
              <div className="relative">
                <WalletConnectionRequired />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}