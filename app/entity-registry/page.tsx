'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Amana_logo.png?height=32&width=32"
                width={32}
                height={32}
                alt="Amana CE Logo"
              />
              <span className="inline-block font-bold">Amana CE</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4 md:px-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Entity Registry</h1>
            <p className="text-muted-foreground mt-2">
              Create or restore your SACCO entity on the Cardano blockchain
            </p>
          </div>

          {isWalletConnected ? (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'create' | 'restore')}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="create">Create New Entity</TabsTrigger>
                <TabsTrigger value="restore">Restore Entity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <EntityRegistrationForm />
              </TabsContent>
              
              <TabsContent value="restore">
                <EntityRestoreForm />
              </TabsContent>
            </Tabs>
          ) : (
            <WalletConnectionRequired />
          )}
        </div>
      </main>
    </div>
  );
}