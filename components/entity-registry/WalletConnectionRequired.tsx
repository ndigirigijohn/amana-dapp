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
          To use the Amana CE platform, you need to connect a Cardano wallet like Eternl, Nami, or Lace.
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
              <img src="data:image/jpeg;base64,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" alt="Eternl Wallet" className="h-full w-full object-contain" />
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
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODYuMTcgNDk5Ljg2Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzM0OWVhMzt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBpZD0icGF0aDE2IiBjbGFzcz0iY2xzLTEiIGQ9Ik03My44Nyw1Mi4xNSw2Mi4xMSw0MC4wN0EyMy45MywyMy45MywwLDAsMSw0MS45LDYxLjg3TDU0LDczLjA5LDQ4Ni4xNyw0NzZaTTEwMi40LDE2OC45M1Y0MDkuNDdhMjMuNzYsMjMuNzYsMCwwLDEsMzIuMTMtMi4xNFYyNDUuOTRMMzk1LDQ5OS44Nmg0NC44N1ptMzAzLjM2LTU1LjU4YTIzLjg0LDIzLjg0LDAsMCwxLTE2LjY0LTYuNjh2MTYyLjhMMTMzLjQ2LDE1LjU3SDg0TDQyMS4yOCwzNDUuNzlWMTA3LjZBMjMuNzIsMjMuNzIsMCwwLDEsNDA1Ljc2LDExMy4zNVoiLz48cGF0aCBpZD0icGF0aDE4IiBjbGFzcz0iY2xzLTEiIGQ9Ik0zOC4yNywwQTM4LjI1LDM4LjI1LDAsMSwwLDc2LjQ5LDM4LjI3djBBMzguMjgsMzguMjgsMCwwLDAsMzguMjcsMFpNNDEuOSw2MS44YTIyLDIyLDAsMCwxLTMuNjMuMjhBMjMuOTQsMjMuOTQsMCwxLDEsNjIuMTgsMzguMTNWNDBBMjMuOTQsMjMuOTQsMCwwLDEsNDEuOSw2MS44WiIvPjxwYXRoIGlkPSJwYXRoMjAiIGNsYXNzPSJjbHMtMSIgZD0iTTQwNS43Niw1MS4yYTM4LjI0LDM4LjI0LDAsMCwwLDAsNzYuNDYsMzcuNTcsMzcuNTcsMCwwLDAsMTUuNTItMy4zQTM4LjIyLDM4LjIyLDAsMCwwLDQwNS43Niw1MS4yWm0xNS41Miw1Ni40YTIzLjkxLDIzLjkxLDAsMSwxLDguMzktMTguMThBMjMuOTEsMjMuOTEsMCwwLDEsNDIxLjI4LDEwNy42WiIvPjxwYXRoIGlkPSJwYXRoMjIiIGNsYXNzPSJjbHMtMSIgZD0iTTEzNC41OCwzOTAuODFBMzguMjUsMzguMjUsMCwxLDAsMTU3LjkyLDQyNmEzOC4yNCwzOC4yNCwwLDAsMC0yMy4zNC0zNS4yMlptLTE1LDU5LjEzQTIzLjkxLDIzLjkxLDAsMSwxLDE0My41NCw0MjZhMjMuOSwyMy45LDAsMCwxLTIzLjk0LDIzLjkxWiIvPjwvZz48L2c+PC9zdmc+" 
              alt="Nami Wallet" className="h-full w-full object-contain" />
            </div>
            <span className="font-medium">Nami Wallet</span>
          </a>
          <a 
            href="https://www.lace.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-12 w-12 mb-2">
              <img src="https://lh3.googleusercontent.com/xOTh2dKfmS7bSEF03vBmlg1PLi3sjnU4VCcATSh_liKlfcajtIZAsDtYfZR_kNMguWIEy8INmDgDeKw3qQdVIaU4LsQ=s60"
               alt="Lace Wallet" className="h-full w-full object-contain" />
            </div>
            <span className="font-medium">Lace Wallet</span>
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