'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Vote,
  Plus,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';

// Mock data for governance proposals
const mockProposals = [
  {
    id: 'prop_001',
    title: 'Equipment Purchase Proposal',
    description: 'Proposal to purchase new agricultural equipment for improved productivity',
    category: 'treasury',
    amount: 500,
    proposer: 'John Mwangi',
    status: 'active',
    votesFor: 8,
    votesAgainst: 2,
    totalVotes: 10,
    requiredVotes: 12,
    endTime: Date.now() + 86400000 * 2, // 2 days from now
    createdAt: Date.now() - 86400000, // 1 day ago
    quorum: 60,
    threshold: 51
  },
  {
    id: 'prop_002',
    title: 'Membership Fee Adjustment',
    description: 'Adjust monthly membership fee from 500 to 600 KES to cover operational costs',
    category: 'parameter',
    amount: 0,
    proposer: 'Sarah Kimani',
    status: 'approved',
    votesFor: 9,
    votesAgainst: 3,
    totalVotes: 12,
    requiredVotes: 12,
    endTime: Date.now() - 86400000, // 1 day ago
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
    quorum: 60,
    threshold: 51
  },
  {
    id: 'prop_003',
    title: 'New Member Admission',
    description: 'Approve admission of Peter Ochieng as a new cooperative member',
    category: 'membership',
    amount: 0,
    proposer: 'Mary Wanjiku',
    status: 'active',
    votesFor: 7,
    votesAgainst: 1,
    totalVotes: 8,
    requiredVotes: 12,
    endTime: Date.now() + 86400000 * 5, // 5 days from now
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    quorum: 60,
    threshold: 51
  },
  {
    id: 'prop_004',
    title: 'Emergency Fund Allocation',
    description: 'Allocate 300 ADA to emergency fund for unexpected expenses',
    category: 'treasury',
    amount: 300,
    proposer: 'David Ochieng',
    status: 'rejected',
    votesFor: 4,
    votesAgainst: 8,
    totalVotes: 12,
    requiredVotes: 12,
    endTime: Date.now() - 86400000 * 3, // 3 days ago
    createdAt: Date.now() - 86400000 * 7, // 1 week ago
    quorum: 60,
    threshold: 51
  }
];

export default function GovernancePage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Voting ended';
    
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
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'active':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'treasury':
        return <span className="bg-blue-500/20 text-blue-400 p-2 rounded-xl">💰</span>;
      case 'parameter':
        return <span className="bg-purple-500/20 text-purple-400 p-2 rounded-xl">⚙️</span>;
      case 'membership':
        return <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">👥</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 p-2 rounded-xl">📄</span>;
    }
  };

  const activeProposals = mockProposals.filter(p => p.status === 'active').length;
  const totalVotingPower = 8.5; // User's voting power percentage
  const votingThreshold = entityData?.votingThreshold || 51;
  const participationRate = 85; // Mock participation rate

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesCategory = selectedFilter === 'all' || proposal.category === selectedFilter;
    const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Governance Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Governance</h1>
              <p className="text-gray-300 text-lg">Participate in cooperative decision-making and vote on proposals</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Create Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GovernanceStatCard
          title="Active Proposals"
          value={`${activeProposals}`}
          change="3 pending votes"
          icon={Vote}
          positive={true}
        />
        <GovernanceStatCard
          title="Your Voting Power"
          value={`${totalVotingPower}%`}
          change="Based on stake"
          icon={TrendingUp}
          positive={true}
        />
        <GovernanceStatCard
          title="Voting Threshold"
          value={`${votingThreshold}%`}
          change="Required to pass"
          icon={Target}
          positive={true}
        />
        <GovernanceStatCard
          title="Participation Rate"
          value={`${participationRate}%`}
          change="Last 30 days"
          icon={Activity}
          positive={true}
        />
      </div>

      {/* Voting Power & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Your Voting Power */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Your Voting Power</h3>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{totalVotingPower}%</span>
              </div>
              <p className="text-gray-400">of total voting power</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Proposals Voted</span>
                <span className="text-white font-medium">8/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Voting Streak</span>
                <span className="text-emerald-400 font-medium">5 consecutive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/dashboard/governance/voting" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Vote className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Cast Vote</p>
                      <p className="text-sm text-gray-400">Vote on active proposals</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-xl">
                    <Plus className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">New Proposal</p>
                    <p className="text-sm text-gray-400">Submit for voting</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">View Analytics</p>
                    <p className="text-sm text-gray-400">Governance metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <Award className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Voting History</p>
                    <p className="text-sm text-gray-400">Past participation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">All Proposals</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="all">All Categories</option>
                  <option value="treasury">Treasury</option>
                  <option value="parameter">Parameters</option>
                  <option value="membership">Membership</option>
                </select>
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                getTimeRemaining={getTimeRemaining}
                getStatusIcon={getStatusIcon}
                getCategoryIcon={getCategoryIcon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GovernanceStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  positive 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ElementType; 
  positive: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-6 w-6 text-emerald-400" />
          <div className={`text-xs px-2 py-1 rounded-lg ${positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {change}
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ 
  proposal, 
  getTimeRemaining, 
  getStatusIcon, 
  getCategoryIcon 
}: { 
  proposal: any; 
  getTimeRemaining: (endTime: number) => string; 
  getStatusIcon: (status: string) => React.ReactNode; 
  getCategoryIcon: (category: string) => React.ReactNode;
}) {
  const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
  const quorumMet = proposal.totalVotes >= (proposal.requiredVotes * proposal.quorum / 100);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          {getCategoryIcon(proposal.category)}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-semibold text-white">{proposal.title}</h4>
              {getStatusIcon(proposal.status)}
            </div>
            <p className="text-gray-400 mb-2">{proposal.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Proposed by {proposal.proposer}</span>
              {proposal.amount > 0 && <span>Amount: {proposal.amount} ₳</span>}
              <span>{getTimeRemaining(proposal.endTime)}</span>
            </div>
          </div>
        </div>
        {proposal.status === 'active' && (
          <div className="flex space-x-2">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">
              <ThumbsDown className="h-4 w-4 mr-1" />
              No
            </Button>
          </div>
        )}
      </div>

      {/* Voting Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Voting Progress</span>
          <span className="text-white">{proposal.totalVotes}/{proposal.requiredVotes} votes</span>
        </div>
        
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(proposal.totalVotes / proposal.requiredVotes) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-400">For: {proposal.votesFor}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Against: {proposal.votesAgainst}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm px-2 py-1 rounded-lg ${quorumMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {quorumMet ? 'Quorum Met' : 'Quorum Pending'}
            </span>
            <span className="text-sm text-gray-400">{votePercentage.toFixed(1)}% approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}