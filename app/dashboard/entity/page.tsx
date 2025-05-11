'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Users, 
  CheckCircle, 
  FileText, 
  Settings, 
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EntityPage() {
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load entity data from local storage
    const loadEntityData = () => {
      setIsLoading(true);
      try {
        const currentEntityData = localStorage.getItem('amana_current_entity');
        if (currentEntityData) {
          const parsedEntityData = JSON.parse(currentEntityData);
          setEntityData(parsedEntityData);
        }
      } catch (error) {
        console.error("Error loading entity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntityData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No Entity Data Found</h3>
        <p className="text-muted-foreground mt-2">Please create or restore an entity.</p>
        <Button asChild className="mt-4">
          <Link href="/entity-registry">Go to Entity Registry</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Entity overview card */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Overview</CardTitle>
          <CardDescription>
            Details and statistics about your SACCO entity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created On</p>
                <p className="font-medium">{formatDate(entityData.creationDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Governance Model</p>
                <p className="font-medium capitalize">{entityData.governanceModel}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Voting Threshold</p>
                <p className="font-medium">{entityData.votingThreshold}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membership Fee</p>
                <p className="font-medium">{entityData.membershipFee} KES</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">About</h3>
            <p className="text-muted-foreground">
              {entityData.description}
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Entity Configuration</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${entityData.enableKYC ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>KYC Requirements {entityData.enableKYC ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${entityData.treasuryMultisig ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Multi-signature Treasury {entityData.treasuryMultisig ? 'Enabled' : 'Disabled'}</span>
              </div>
              {entityData.treasuryMultisig && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Required signatures:</span>
                  <span className="font-medium">{entityData.treasurySignatures}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members overview card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>Recent members of your SACCO</CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/entity/members">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock member data - in a real app this would come from your backend */}
              <TableRow>
                <TableCell className="font-medium">You (Founder)</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatDate(entityData.creationDate)}</TableCell>
              </TableRow>
              {/* You can add more mock members or fetch real ones */}
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Invite members to join your SACCO
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Blockchain info card */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Information</CardTitle>
          <CardDescription>
            Technical details about your entity on the Cardano blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Entity ID</p>
              <p className="font-mono bg-muted p-2 rounded-md overflow-x-auto text-sm">
                {entityData.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Founder Address (Verification Key Hash)</p>
              <p className="font-mono bg-muted p-2 rounded-md overflow-x-auto text-sm">
                {entityData.founder}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Smart Contract Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Deployed and Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}