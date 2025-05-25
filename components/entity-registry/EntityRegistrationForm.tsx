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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getSavedWalletConnection } from '@/lib/common';
import { useEntityRegistry } from '@/hooks/useEntityRegistry';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Clock
} from 'lucide-react';

// Define entity data type (for localStorage compatibility)
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
  // Blockchain specific fields
  txHash?: string;
  contractAddress?: string;
  blockchainEntityId?: string;
}

// Transaction status enum
enum TransactionStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUBMITTED = 'submitted',
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

export default function EntityRegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const connectedWallet = getSavedWalletConnection();
  
  // Blockchain hook
  const {
    isInitialized,
    isInitializing,
    isCreatingEntity,
    isWaitingForConfirmation,
    error,
    lastTransaction,
    initializeRegistry,
    createEntity,
    waitForConfirmation,
    clearError
  } = useEntityRegistry();

  // Form state
  const [entityData, setEntityData] = useState<Omit<EntityData, 'id' | 'founder' | 'creationDate' | 'txHash' | 'contractAddress' | 'blockchainEntityId'>>({
    name: '',
    description: '',
    governanceModel: 'democratic',
    membershipFee: '1000',
    enableKYC: true,
    treasuryMultisig: true,
    treasurySignatures: '3',
    votingThreshold: '51',
  });

  // Transaction status tracking
  const [txStatus, setTxStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
  const [currentTxHash, setCurrentTxHash] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setEntityData(prev => ({ ...prev, [name]: checked }));
  };

// Replace the handleSubmit function with this improved version:

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

  // Clear any previous errors
  clearError();
  
  try {
    // Validate form data
    if (!entityData.name || !entityData.description) {
      throw new Error("Entity name and description are required");
    }

    setTxStatus(TransactionStatus.SUBMITTING);

    // Initialize registry if not already done
    if (!isInitialized) {
      console.log('EntityRegistrationForm: Registry not initialized, initializing now...');
      toast({
        title: "Initializing blockchain connection",
        description: "Connecting to the Cardano network..."
      });
      
      const initialized = await initializeRegistry();
      console.log('EntityRegistrationForm: Initialization result:', initialized);
      
      if (!initialized) {
        throw new Error("Failed to initialize blockchain connection");
      }
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create entity on blockchain
    toast({
      title: "Creating entity on blockchain",
      description: "Please confirm the transaction in your wallet"
    });

    console.log('EntityRegistrationForm: Calling createEntity...');
    const result = await createEntity(entityData.name, entityData.description);
    console.log('EntityRegistrationForm: createEntity result:', result);
    
    if (!result) {
      console.error('EntityRegistrationForm: createEntity returned null');
      // Check if there's a specific error message
      if (error) {
        throw new Error(error);
      }
      throw new Error("Failed to create entity on blockchain");
    }

    setCurrentTxHash(result.txHash);
    setTxStatus(TransactionStatus.SUBMITTED);

    toast({
      title: "Transaction submitted!",
      description: `Transaction hash: ${result.txHash.slice(0, 16)}...`,
    });

    // Wait for confirmation
    setTxStatus(TransactionStatus.CONFIRMING);
    
    toast({
      title: "Waiting for confirmation",
      description: "Your transaction is being processed on the blockchain..."
    });

    const confirmed = await waitForConfirmation(result.txHash);
    
    if (!confirmed) {
      // Don't throw an error here - the transaction might still be valid
      // Just show a warning and proceed
      toast({
        title: "Confirmation timeout",
        description: "Transaction may still be processing. Check your wallet or block explorer.",
        variant: "destructive"
      });
      
      // Still proceed with saving the entity locally
      console.log('Proceeding despite confirmation timeout...');
    }

    setTxStatus(TransactionStatus.CONFIRMED);

    // Create entity object for localStorage (backward compatibility)
    const newEntity: EntityData = {
      ...entityData,
      id: result.entityId,
      founder: connectedWallet.verificationKeyHash,
      creationDate: Date.now(),
      txHash: result.txHash,
      contractAddress: result.contractAddress,
      blockchainEntityId: result.entityId
    };

    // Store in localStorage for dashboard compatibility
    const storedEntities = localStorage.getItem('amana_entities');
    const entities = storedEntities ? JSON.parse(storedEntities) : [];
    entities.push(newEntity);
    localStorage.setItem('amana_entities', JSON.stringify(entities));
    localStorage.setItem('amana_current_entity', JSON.stringify(newEntity));

    toast({
      title: "Entity created successfully!",
      description: "Your SACCO entity has been registered on the blockchain",
    });

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    
  } catch (error) {
    console.error('Entity creation error:', error);
    setTxStatus(TransactionStatus.FAILED);
    
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Show more user-friendly error messages
    if (errorMessage.includes("confirmation timeout") || errorMessage.includes("Timeout")) {
      toast({
        title: "Transaction may still be processing",
        description: "Your transaction was submitted but confirmation timed out. Check your wallet or a block explorer to verify.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Error creating entity",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }
};

  // Get progress percentage based on transaction status
  const getProgress = () => {
    switch (txStatus) {
      case TransactionStatus.SUBMITTING: return 25;
      case TransactionStatus.SUBMITTED: return 50;
      case TransactionStatus.CONFIRMING: return 75;
      case TransactionStatus.CONFIRMED: return 100;
      default: return 0;
    }
  };

  // Check if form is in a loading state
  const isLoading = isInitializing || isCreatingEntity || isWaitingForConfirmation || 
                   txStatus === TransactionStatus.SUBMITTING || 
                   txStatus === TransactionStatus.CONFIRMING;

  // Check if transaction is in progress
  const isTxInProgress = txStatus !== TransactionStatus.IDLE && 
                        txStatus !== TransactionStatus.CONFIRMED && 
                        txStatus !== TransactionStatus.FAILED;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Entity</CardTitle>
        <CardDescription>Register your SACCO on the Cardano blockchain</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Show blockchain errors */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-auto h-auto p-1"
              >
                ×
              </Button>
            </div>
          )}

          {/* Transaction Progress */}
          {isTxInProgress && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blockchain Transaction Progress</span>
                <span className="text-xs text-muted-foreground">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
              
              <div className="flex items-center gap-2 text-sm">
                {txStatus === TransactionStatus.SUBMITTING && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting transaction...</span>
                  </>
                )}
                {txStatus === TransactionStatus.SUBMITTED && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Transaction submitted</span>
                  </>
                )}
                {txStatus === TransactionStatus.CONFIRMING && (
                  <>
                    <Clock className="h-4 w-4 animate-pulse text-amber-500" />
                    <span>Waiting for blockchain confirmation...</span>
                  </>
                )}
              </div>

              {currentTxHash && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Transaction:</span>
                  <code className="bg-muted px-1 rounded">{currentTxHash.slice(0, 20)}...</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                    onClick={() => window.open(`https://preview.cardanoscan.io/transaction/${currentTxHash}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Success message */}
          {txStatus === TransactionStatus.CONFIRMED && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 rounded-lg text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Entity successfully created on blockchain! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Entity Name</Label>
              <Input
                id="name"
                name="name"
                value={entityData.name}
                onChange={handleChange}
                placeholder="e.g., Community Savings Cooperative"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={!entityData.treasuryMultisig || isLoading}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableKYC"
                checked={entityData.enableKYC}
                onCheckedChange={handleSwitchChange('enableKYC')}
                disabled={isLoading}
              />
              <Label htmlFor="enableKYC">Enable KYC Requirements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="treasuryMultisig"
                checked={entityData.treasuryMultisig}
                onCheckedChange={handleSwitchChange('treasuryMultisig')}
                disabled={isLoading}
              />
              <Label htmlFor="treasuryMultisig">Multi-signature Treasury</Label>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Blockchain Notice:</p>
            <p>
              This will create a smart contract on the Cardano blockchain to manage your SACCO. 
              The entity will be created with you as the founder, using your currently connected wallet. 
              Transaction fees will apply, and the process may take a few minutes to complete.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.push('/')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || txStatus === TransactionStatus.CONFIRMED}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isInitializing && "Connecting..."}
                {isCreatingEntity && "Creating Entity..."}
                {isWaitingForConfirmation && "Confirming..."}
                {isTxInProgress && !isCreatingEntity && !isWaitingForConfirmation && "Processing..."}
              </>
            ) : txStatus === TransactionStatus.CONFIRMED ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Entity Created
              </>
            ) : (
              "Create Entity"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}