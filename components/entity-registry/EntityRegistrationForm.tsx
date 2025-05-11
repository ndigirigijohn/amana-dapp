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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getSavedWalletConnection } from '@/lib/common';

// Define entity data type
interface EntityData {
  id: string;
  name: string;
  description: string;
  governanceModel: 'democratic' | 'representative' | 'weighted';
  membershipFee: string;
  enableKYC: boolean;
  treasuryMultisig: boolean;
  treasurySignatures: string;
  votingThreshold: string;
  founder: string;
  creationDate: number;
}

export default function EntityRegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const connectedWallet = getSavedWalletConnection();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityData, setEntityData] = useState<Omit<EntityData, 'id' | 'founder' | 'creationDate'>>({
    name: '',
    description: '',
    governanceModel: 'democratic',
    membershipFee: '1000',
    enableKYC: true,
    treasuryMultisig: true,
    treasurySignatures: '3',
    votingThreshold: '51',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setEntityData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectedWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an entity",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!entityData.name || !entityData.description) {
        throw new Error("Entity name and description are required");
      }
      
      // Create entity object
      const newEntity: EntityData = {
        ...entityData,
        id: `entity-${Date.now()}`,
        founder: connectedWallet.verificationKeyHash,
        creationDate: Date.now()
      };
      
      // In a production app, this would be where we'd interact with the blockchain
      // For now, we'll just simulate a delay and store in localStorage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store entity in local storage
      const storedEntities = localStorage.getItem('amana_entities');
      const entities = storedEntities ? JSON.parse(storedEntities) : [];
      entities.push(newEntity);
      localStorage.setItem('amana_entities', JSON.stringify(entities));
      
      // Set current entity
      localStorage.setItem('amana_current_entity', JSON.stringify(newEntity));
      
      toast({
        title: "Entity created successfully",
        description: "Your SACCO entity has been registered"
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      toast({
        title: "Error creating entity",
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
        <CardTitle>Create New Entity</CardTitle>
        <CardDescription>Register your SACCO on the blockchain</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Entity Name</Label>
              <Input
                id="name"
                name="name"
                value={entityData.name}
                onChange={handleChange}
                placeholder="e.g., Community Savings Cooperative"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={entityData.description}
                onChange={handleChange}
                placeholder="Describe the purpose and goals of your SACCO..."
                rows={4}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Governance Settings</h3>
            <p className="text-sm text-muted-foreground">Configure how your SACCO will operate</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="governanceModel">Governance Model</Label>
              <select
                id="governanceModel"
                name="governanceModel"
                value={entityData.governanceModel}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="democratic">Democratic (One Member, One Vote)</option>
                <option value="representative">Representative (Elected Board)</option>
                <option value="weighted">Weighted (Based on Contribution)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="membershipFee">Membership Fee (KES)</Label>
              <Input
                id="membershipFee"
                name="membershipFee"
                type="number"
                min="0"
                value={entityData.membershipFee}
                onChange={handleChange}
                placeholder="1000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="votingThreshold">Voting Threshold (%)</Label>
              <Input
                id="votingThreshold"
                name="votingThreshold"
                type="number"
                min="1"
                max="100"
                value={entityData.votingThreshold}
                onChange={handleChange}
                placeholder="51"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="treasurySignatures">Required Treasury Signatures</Label>
              <Input
                id="treasurySignatures"
                name="treasurySignatures"
                type="number"
                min="1"
                value={entityData.treasurySignatures}
                onChange={handleChange}
                placeholder="3"
                disabled={!entityData.treasuryMultisig}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableKYC"
                checked={entityData.enableKYC}
                onCheckedChange={handleSwitchChange('enableKYC')}
              />
              <Label htmlFor="enableKYC">Enable KYC Requirements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="treasuryMultisig"
                checked={entityData.treasuryMultisig}
                onCheckedChange={handleSwitchChange('treasuryMultisig')}
              />
              <Label htmlFor="treasuryMultisig">Multi-signature Treasury</Label>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Note:</p>
            <p>
              This will create a smart contract on the Cardano blockchain to manage your SACCO. 
              The entity will be created with you as the founder, using your currently connected wallet. 
              All settings can be updated later through governance proposals.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Entity..." : "Create Entity"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}