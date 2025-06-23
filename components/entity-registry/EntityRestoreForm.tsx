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
import { 
  RefreshCw, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Database,
  Key,
  Shield
} from 'lucide-react';

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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-b border-white/10 p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Restore Existing Entity</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Import a SACCO that already exists on the blockchain
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Database className="w-4 h-4" />
            <span>Blockchain Lookup</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <Key className="w-4 h-4" />
            <span>Identity Verification</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <Shield className="w-4 h-4" />
            <span>Secure Access</span>
          </div>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="p-8 space-y-8">
          {/* Entity Lookup Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Entity Identification</h3>
                <p className="text-gray-400 text-sm">Provide either an Entity ID or Policy ID to locate your SACCO</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="entityId" className="text-white font-medium">Entity ID (Optional)</Label>
                <Input
                  id="entityId"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  placeholder="e.g., entity-1234567890"
                  disabled={isSubmitting}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500/50 rounded-xl h-12"
                />
                <p className="text-sm text-gray-400">
                  If you know the specific Entity ID, enter it here
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="flex-grow h-px bg-white/20"></div>
                <span className="px-4 text-sm text-gray-400 font-medium">OR</span>
                <div className="flex-grow h-px bg-white/20"></div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="policyId" className="text-white font-medium">Entity Policy ID</Label>
                <Input
                  id="policyId"
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  placeholder="e.g., a1b2c3d4e5f6..."
                  disabled={isSubmitting}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500/50 rounded-xl h-12"
                />
                <p className="text-sm text-gray-400">
                  The unique identifier for your entity on the blockchain
                </p>
              </div>
            </div>
          </div>
          
          {/* Verification Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Access Verification</h3>
                <p className="text-gray-400 text-sm">Your wallet will be verified against the entity's authorized members</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Important Notice</h4>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>
                        • You must be the founder or have administrative rights to restore this entity
                      </p>
                      <p>
                        • Your currently connected wallet will be used to verify your identity and permissions
                      </p>
                      <p>
                        • Only authorized members can restore and access entity data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">How Entity Restoration Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-medium text-white">Lookup</span>
                </div>
                <p className="text-sm text-gray-400">
                  We search the Cardano blockchain for your entity using the provided ID
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-medium text-white">Verify</span>
                </div>
                <p className="text-sm text-gray-400">
                  Your wallet signature is verified against authorized entity members
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-medium text-white">Restore</span>
                </div>
                <p className="text-sm text-gray-400">
                  Full entity access is restored with all members, treasury, and governance data
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-8 border-t border-white/10 bg-white/5">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.push('/')}
            disabled={isSubmitting}
            className="border-white/20 text-white hover:bg-white/10 hover:border-cyan-500/50 rounded-xl px-6 py-3"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!entityId && !policyId)}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-500/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Restoring Entity...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Restore Entity
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}