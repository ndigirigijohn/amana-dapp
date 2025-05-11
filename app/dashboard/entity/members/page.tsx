'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  MoreHorizontal,
  AlertCircle,
  Filter
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

// Mock data for members
const MOCK_MEMBERS = [
  { 
    id: 'member-1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    walletAddress: 'addr1qxck3...9yaru09', 
    role: 'Chairperson',
    shares: 10,
    kycVerified: true,
    joinedDate: new Date(2023, 5, 15).getTime()
  },
  { 
    id: 'member-2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    walletAddress: 'addr1qy5m4...h3vmw4q2', 
    role: 'Treasurer',
    shares: 8,
    kycVerified: true,
    joinedDate: new Date(2023, 6, 22).getTime()
  },
  { 
    id: 'member-3', 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    walletAddress: 'addr1q9cz5...v2q5zmy3', 
    role: 'Member',
    shares: 5,
    kycVerified: false,
    joinedDate: new Date(2023, 7, 10).getTime()
  },
  { 
    id: 'member-4', 
    name: 'Sarah Williams', 
    email: 'sarah@example.com', 
    walletAddress: 'addr1qxfj90...h33jkl52', 
    role: 'Secretary',
    shares: 7,
    kycVerified: true,
    joinedDate: new Date(2023, 8, 5).getTime()
  },
  { 
    id: 'member-5', 
    name: 'David Brown', 
    email: 'david@example.com', 
    walletAddress: 'addr1q8nst4...k42nzxp9', 
    role: 'Member',
    shares: 4,
    kycVerified: false,
    joinedDate: new Date(2023, 9, 12).getTime()
  }
];

// Mock pending invitations
const MOCK_INVITATIONS = [
  {
    id: 'inv-1',
    email: 'marcos@example.com',
    sentDate: new Date(2023, 10, 5).getTime(),
    expiryDate: new Date(2023, 10, 12).getTime(),
    status: 'pending'
  },
  {
    id: 'inv-2',
    email: 'lucia@example.com',
    sentDate: new Date(2023, 10, 8).getTime(),
    expiryDate: new Date(2023, 10, 15).getTime(),
    status: 'pending'
  }
];

export default function MembersPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Load entity data
  useEffect(() => {
    const loadEntityData = async () => {
      setIsLoading(true);
      
      const walletConnection = getSavedWalletConnection();
      if (!walletConnection) {
        router.push('/entity-registry');
        return;
      }
      
      const currentEntityData = localStorage.getItem('amana_current_entity');
      if (!currentEntityData) {
        router.push('/entity-registry');
        return;
      }
      
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        setEntityData(parsedEntityData);
      } catch (error) {
        console.error("Error parsing entity data:", error);
      }
      
      setIsLoading(false);
    };
    
    loadEntityData();
  }, [router]);

  // Filter members based on search query and active tab
  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'verified') return matchesSearch && member.kycVerified;
    if (activeTab === 'unverified') return matchesSearch && !member.kycVerified;
    
    return matchesSearch;
  });

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Members
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your SACCO members and their permissions
        </p>
      </div>

      {/* Member stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Total Members</span>
                <span className="text-3xl font-bold">{MOCK_MEMBERS.length}</span>
              </div>
              <div className="rounded-full p-3 bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">KYC Verified</span>
                <span className="text-3xl font-bold">
                  {MOCK_MEMBERS.filter(m => m.kycVerified).length}/{MOCK_MEMBERS.length}
                </span>
              </div>
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Pending Invites</span>
                <span className="text-3xl font-bold">{MOCK_INVITATIONS.length}</span>
              </div>
              <div className="rounded-full p-3 bg-amber-500/10">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member management */}
      <Card>
        <CardHeader className="space-y-0 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Member Management</CardTitle>
              <CardDescription className="mt-1">View and manage all members of your SACCO</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="gap-2" size="sm">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={activeTab === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('all')}
                size="sm"
              >
                All Members
              </Button>
              <Button 
                variant={activeTab === 'verified' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('verified')}
                size="sm"
              >
                Verified
              </Button>
              <Button 
                variant={activeTab === 'unverified' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('unverified')}
                size="sm"
              >
                Unverified
              </Button>
              <Button 
                variant={activeTab === 'invites' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('invites')}
                size="sm"
              >
                Invitations
              </Button>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="w-full md:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* All Members Tab */}
          {activeTab === 'all' && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No members found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          {member.kycVerified ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                              <XCircle className="mr-1 h-3 w-3" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(member.joinedDate)}</TableCell>
                        <TableCell>{member.shares}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuItem>Update Shares</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!member.kycVerified && (
                                <DropdownMenuItem>Mark as Verified</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Verified Members Tab */}
          {activeTab === 'verified' && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No verified members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(member.joinedDate)}</TableCell>
                        <TableCell>{member.shares}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuItem>Update Shares</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Unverified Members Tab */}
          {activeTab === 'unverified' && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No unverified members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            <XCircle className="mr-1 h-3 w-3" />
                            Unverified
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(member.joinedDate)}</TableCell>
                        <TableCell>{member.shares}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuItem>Update Shares</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Verified</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Invitations Tab */}
          {activeTab === 'invites' && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_INVITATIONS.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No pending invitations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    MOCK_INVITATIONS.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell>{formatDate(invite.sentDate)}</TableCell>
                        <TableCell>{formatDate(invite.expiryDate)}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Cancel Invitation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}