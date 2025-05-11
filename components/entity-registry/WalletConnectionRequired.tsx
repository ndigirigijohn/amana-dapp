'use client';

import { ArrowRight, Wallet } from 'lucide-react';
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
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Wallet Connection Required</CardTitle>
        <CardDescription>
          You need to connect a Cardano wallet to create or restore an entity
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="mb-6">
          To use the Amana CE platform, you need to connect a Cardano wallet like Eternl, Nami, or Flint.
          This allows you to interact with the Cardano blockchain and manage your SACCO entity.
        </p>
        <p className="mb-6">
          If you don't have a wallet yet, you'll need to install one first:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <a 
            href="https://eternl.io/app/mainnet/welcome" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-12 w-12 mb-2">
              <img src="https://eternl.io/app/apple-touch-icon.png" alt="Eternl Wallet" className="h-full w-full object-contain" />
            </div>
            <span className="font-medium">Eternl Wallet</span>
          </a>
          <a 
            href="https://namiwallet.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-12 w-12 mb-2">
              <img src="https://namiwallet.io/favicon.ico" alt="Nami Wallet" className="h-full w-full object-contain" />
            </div>
            <span className="font-medium">Nami Wallet</span>
          </a>
          <a 
            href="https://flint-wallet.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-12 w-12 mb-2">
              <img src="https://flint-wallet.com/favicon.ico" alt="Flint Wallet" className="h-full w-full object-contain" />
            </div>
            <span className="font-medium">Flint Wallet</span>
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={handleConnectClick} className="px-6">
          Connect Wallet
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}