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
  Calendar,
  MoreVertical,
  Trash,
  Edit,
  Download,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function EntityPage() {
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

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

  const clearEntity = () => {
    try {
      // Remove entity from local storage
      localStorage.removeItem('amana_current_entity');
      // Also remove from entities list if it exists there
      const storedEntities = localStorage.getItem('amana_entities');
      if (storedEntities) {
        const entities = JSON.parse(storedEntities);
        const updatedEntities = entities.filter((entity: any) => entity.id !== entityData.id);
        localStorage.setItem('amana_entities', JSON.stringify(updatedEntities));
      }
      // Redirect to entity registry
      router.push('/entity-registry');
    } catch (error) {
      console.error("Error clearing entity data:", error);
    }
  };

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
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Entity Overview</CardTitle>
            <CardDescription>
              Details and statistics about your SACCO entity
            </CardDescription>
          </div>
          {/* Settings dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Entity settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                <span>Edit Entity</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Download className="h-4 w-4" />
                <span>Export Entity Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
                <span>Clear Entity</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Confirmation Dialog for Clear Entity */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Clear Entity Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear this entity? This action will remove all local data
              related to this SACCO entity. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearEntity}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Entity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}