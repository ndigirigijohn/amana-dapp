'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSavedWalletConnection } from '@/lib/common';

export default function EntityRestoreForm() {
  const router = useRouter();
  const { toast } = useToast();
  const connectedWallet = getSavedWalletConnection();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityId, setEntityId] = useState('');
  const [policyId, setPolicyId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectedWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to restore an entity",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!entityId && !policyId) {
        throw new Error("Entity ID or Policy ID is required");
      }
      
      // In a production app, this would be where we'd interact with the blockchain
      // For now, we'll just simulate a delay and display a message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (policyId) {
        // Simulate creating a mock entity for demonstration
        const mockEntity = {
          id: `entity-${Date.now()}`,
          name: "Restored SACCO Entity",
          description: "This entity was restored using Policy ID: " + policyId,
          governanceModel: "democratic",
          membershipFee: "1000",
          enableKYC: true,
          treasuryMultisig: true,
          treasurySignatures: "3",
          votingThreshold: "51",
          founder: connectedWallet.verificationKeyHash,
          creationDate: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
        };
        
        // Store in local storage for demo purposes
        localStorage.setItem('amana_current_entity', JSON.stringify(mockEntity));
        
        const storedEntities = localStorage.getItem('amana_entities');
        const entities = storedEntities ? JSON.parse(storedEntities) : [];
        entities.push(mockEntity);
        localStorage.setItem('amana_entities', JSON.stringify(entities));
        
        toast({
          title: "Entity restored successfully",
          description: "Your SACCO entity has been restored from the blockchain"
        });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error("Invalid entity ID or policy ID");
      }
      
    } catch (error) {
      toast({
        title: "Error restoring entity",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restore Existing Entity</CardTitle>
        <CardDescription>Import a SACCO that already exists on the blockchain</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="entityId">Entity ID (Optional)</Label>
              <Input
                id="entityId"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="e.g., entity-1234567890"
              />
              <p className="text-sm text-muted-foreground">
                If you know the specific Entity ID, enter it here
              </p>
            </div>
            
            <div className="my-4 flex items-center">
              <div className="flex-grow h-px bg-muted"></div>
              <span className="px-3 text-sm text-muted-foreground">OR</span>
              <div className="flex-grow h-px bg-muted"></div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="policyId">Entity Policy ID</Label>
              <Input
                id="policyId"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                placeholder="e.g., a1b2c3d4e5f6..."
              />
              <p className="text-sm text-muted-foreground">
                The unique identifier for your entity on the blockchain
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Note:</p>
            <p>
              You must be the founder or have administrative rights to restore this entity.
              Your currently connected wallet will be used to verify your identity and permissions.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Restoring Entity..." : "Restore Entity"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}