'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileCheck, 
  AlertCircle,
  FileText,
  Users,
  BarChart3,
  Plus,
  Edit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Example proposal data - in a real app this would come from your backend
const mockProposals = [
  {
    id: "prop-1",
    title: "Increase membership fee to 1,500 KES",
    description: "Proposal to adjust membership fee to account for inflation",
    category: "parameter",
    creator: "John D.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 2, // 2 days from now
    status: "active",
    votesFor: 4,
    votesAgainst: 1,
    votesAbstain: 0,
    totalVotes: 5
  },
  {
    id: "prop-2",
    title: "Add new treasurer role",
    description: "Introduce a dedicated treasurer role for better financial management",
    category: "membership",
    creator: "Sarah M.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 4, // 4 days from now
    status: "active",
    votesFor: 6,
    votesAgainst: 2,
    votesAbstain: 1,
    totalVotes: 9
  },
  {
    id: "prop-3",
    title: "Approve fund allocation for community project",
    description: "Allocate 500 ADA for the community water project",
    category: "treasury",
    creator: "David K.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
    deadline: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    status: "approved",
    votesFor: 8,
    votesAgainst: 1,
    votesAbstain: 0,
    totalVotes: 9
  },
  {
    id: "prop-4",
    title: "Reduce voting threshold to 60%",
    description: "Lower the voting threshold to improve governance efficiency",
    category: "parameter",
    creator: "Emily T.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
    deadline: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago
    status: "rejected",
    votesFor: 3,
    votesAgainst: 7,
    votesAbstain: 1,
    totalVotes: 11
  }
];

export default function GovernancePage() {
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (deadline: number) => {
    const now = Date.now();
    if (deadline < now) return "Ended";
    
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'active':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'treasury':
        return <span className="bg-blue-500/10 text-blue-500 p-1 rounded">💰</span>;
      case 'parameter':
        return <span className="bg-purple-500/10 text-purple-500 p-1 rounded">⚙️</span>;
      case 'membership':
        return <span className="bg-green-500/10 text-green-500 p-1 rounded">👥</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-500 p-1 rounded">📄</span>;
    }
  };

  const activeProposals = mockProposals.filter(p => p.status === 'active').length;
  const totalVotingPower = 100; // This would be calculated based on the user's stake/shares
  const votingThreshold = entityData?.votingThreshold || 51;

  return (
    <div className="space-y-6">
      {/* Governance summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProposals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your vote
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Voting Power</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotingPower}%</div>
            <p className="text-xs text-muted-foreground">
              Based on your contribution
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voting Threshold</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingThreshold}%</div>
            <p className="text-xs text-muted-foreground">
              Required for approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Eligible to vote
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Governance actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 gap-2">
          <Plus className="h-4 w-4" />
          Create Proposal
        </Button>
        <Button className="flex-1 gap-2" variant="outline">
          <Edit className="h-4 w-4" />
          Edit Governance Settings
        </Button>
      </div>

      {/* Active proposals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Proposals</CardTitle>
            <CardDescription>
              Proposals that require your attention
            </CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/governance/voting">Vote Now</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {mockProposals.filter(p => p.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {mockProposals
                .filter(p => p.status === 'active')
                .map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(proposal.category)}
                        <h3 className="font-medium">{proposal.title}</h3>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        {getTimeRemaining(proposal.deadline)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {proposal.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {Math.round((proposal.votesFor / proposal.totalVotes) * 100)}% of votes 
                          ({proposal.votesFor} / {proposal.totalVotes})
                        </span>
                      </div>
                      <Progress value={(proposal.votesFor / proposal.totalVotes) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>For: {proposal.votesFor}</span>
                        <span>Against: {proposal.votesAgainst}</span>
                        <span>Abstain: {proposal.votesAbstain}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/governance/voting/${proposal.id}`}>Vote</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>No active proposals at the moment</p>
              <p className="text-sm mt-1">
                Create a new proposal to initiate a governance action
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Proposals</CardTitle>
          <CardDescription>
            History of past governance decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProposals
                .filter(p => p.status !== 'active')
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(proposal.status)}
                        <span className="capitalize">{proposal.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{proposal.title}</TableCell>
                    <TableCell className="capitalize">{proposal.category}</TableCell>
                    <TableCell>{proposal.creator}</TableCell>
                    <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                    <TableCell>
                      {proposal.status === 'approved' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Passed: {Math.round((proposal.votesFor / proposal.totalVotes) * 100)}%
                        </Badge>
                      ) : proposal.status === 'rejected' ? (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          Failed: {Math.round((proposal.votesAgainst / proposal.totalVotes) * 100)}%
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/governance/history">View Full History</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}