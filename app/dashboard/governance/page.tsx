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
  Activity,
  RefreshCw
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import { 
  apiService, 
  type EntityData, 
  type GovernanceProposal,
  DEFAULT_ENTITY_DATA
} from '@/lib/api/services';

interface GovernanceStatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  positive: boolean;
  loading?: boolean;
}

function GovernanceStatCard({ title, value, change, icon: Icon, positive, loading }: GovernanceStatCardProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-50"></div>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="h-8 w-16 bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{value}</p>
              )}
            </div>
            <p className={`text-xs ${positive ? 'text-emerald-400' : 'text-orange-400'}`}>
              {loading ? '...' : change}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Icon className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ proposal, onVote }: { proposal: GovernanceProposal; onVote: (proposalId: string, vote: 'for' | 'against') => void }) {
  const getTimeRemaining = (endTime: string) => {
    const now = Date.now();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
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
      case 'passed':
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

  const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
  const quorumMet = proposal.totalVotes >= (proposal.quorumRequired || 0);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(proposal.type)}
          <div>
            <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
            <p className="text-sm text-gray-400">Proposed by {proposal.proposer}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(proposal.status)}
          <span className="text-sm font-medium text-white capitalize">{proposal.status}</span>
        </div>
      </div>

      <p className="text-gray-300 mb-6">{proposal.description}</p>

      <div className="space-y-4">
        {/* Voting Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Votes For vs Against</span>
            <span className="text-sm text-white">
              {proposal.votesFor} / {proposal.totalVotes} ({Math.round(votePercentage)}%)
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${votePercentage}%` }}
            />
          </div>
        </div>

        {/* Voting Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-300">For</span>
            </div>
            <span className="text-white font-medium">{proposal.votesFor}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <ThumbsDown className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-300">Against</span>
            </div>
            <span className="text-white font-medium">{proposal.votesAgainst}</span>
          </div>
        </div>

        {/* Time and Quorum */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            {proposal.status === 'active' ? getTimeRemaining(proposal.endTime) : 'Voting closed'}
          </span>
          <span className={`${quorumMet ? 'text-emerald-400' : 'text-orange-400'}`}>
            Quorum: {quorumMet ? 'Met' : 'Pending'}
          </span>
        </div>

        {/* Voting Buttons */}
        {proposal.status === 'active' && (
          <div className="flex space-x-3 pt-4 border-t border-white/10">
            <Button 
              onClick={() => onVote(proposal.id, 'for')}
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Vote For
            </Button>
            <Button 
              onClick={() => onVote(proposal.id, 'against')}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Vote Against
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadGovernanceData = async (entityId: string, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      // Load entity data
      const entityResponse = await apiService.getEntityData(entityId);
      if (entityResponse.success && entityResponse.data) {
        setEntityData(entityResponse.data);
      } else {
        console.error('Failed to load entity data:', entityResponse.error);
        // Don't show error for demo
      }

      // Load governance proposals
      const proposalsResponse = await apiService.getGovernanceProposals(entityId);
      if (proposalsResponse.success && proposalsResponse.data) {
        setProposals(proposalsResponse.data);
      } else {
        console.error('Failed to load proposals:', proposalsResponse.error);
        // Keep empty array as fallback, don't show error for demo
        setProposals([]);
      }

    } catch (error) {
      console.error('Error loading governance data:', error);
      // Don't show error for demo
      setProposals([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeGovernancePage = async () => {
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
        
        // Set entity data from localStorage immediately
        setEntityData({
          ...DEFAULT_ENTITY_DATA,
          ...parsedEntityData
        });
        setIsLoading(false);
        
        // Then try to load from API if we have an ID
        const entityId = parsedEntityData.id;
        if (entityId) {
          await loadGovernanceData(entityId, false);
        }
      } catch (error) {
        console.error("Error initializing governance page:", error);
        // Don't show error for demo
        setIsLoading(false);
      }
    };

    initializeGovernancePage();
  }, [router]);

  const handleRefresh = () => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        const entityId = parsedEntityData.id;
        if (entityId) {
          loadGovernanceData(entityId, false);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
        // Don't show error for demo
      }
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (!currentEntityData) return;

    try {
      const parsedEntityData = JSON.parse(currentEntityData);
      const entityId = parsedEntityData.id;
      if (!entityId) return;

      const response = await apiService.voteOnProposal(entityId, proposalId, vote);
      if (response.success) {
        // Refresh proposals to get updated vote counts
        await loadGovernanceData(entityId, false);
      } else {
        console.error('Failed to vote:', response.error);
        // Don't show error for demo
      }
    } catch (error) {
      console.error('Error voting on proposal:', error);
      // Don't show error for demo
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading governance data...</p>
        </div>
      </div>
    );
  }

  const activeProposals = proposals.filter(p => p.status === 'active').length;
  const passedProposals = proposals.filter(p => p.status === 'passed').length;
  const totalVotingPower = 8.5; // Mock user's voting power percentage
  const participationRate = proposals.length > 0 
    ? Math.round((proposals.reduce((acc, p) => acc + p.totalVotes, 0) / (proposals.length * (entityData.totalMembers || 1))) * 100)
    : 0;

  const filteredProposals = proposals.filter(proposal => {
    const matchesCategory = selectedFilter === 'all' || proposal.type === selectedFilter;
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
              <p className="text-gray-300 text-lg">Participate in {entityData.name} decision-making and vote on proposals</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl">
                <Eye className="h-4 w-4 mr-2" />
                View History
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>
          </div>
          
          {/* Remove error display for demo */}
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GovernanceStatCard
          title="Active Proposals"
          value={activeProposals}
          change="Awaiting votes"
          icon={Vote}
          positive={false}
          loading={isLoading}
        />
        <GovernanceStatCard
          title="Passed Proposals"
          value={passedProposals}
          change="This quarter"
          icon={CheckCircle}
          positive={true}
          loading={isLoading}
        />
        <GovernanceStatCard
          title="Your Voting Power"
          value={`${totalVotingPower}%`}
          change="Based on shares"
          icon={TrendingUp}
          positive={true}
          loading={isLoading}
        />
        <GovernanceStatCard
          title="Participation Rate"
          value={`${participationRate}%`}
          change="Member engagement"
          icon={Users}
          positive={participationRate > 70}
          loading={isLoading}
        />
      </div>

      {/* Filters and Proposals */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Proposals ({proposals.length})</h3>
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-slate-600 rounded-lg px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="treasury">Treasury</option>
                <option value="parameter">Parameters</option>
                <option value="membership">Membership</option>
                <option value="other">Other</option>
              </select>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="passed">Passed</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {filteredProposals.length > 0 ? (
            <div className="space-y-6">
              {filteredProposals.map((proposal) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal} 
                  onVote={handleVote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {selectedFilter !== 'all' || selectedStatus !== 'all' 
                  ? 'No proposals match your filters' 
                  : 'No proposals found'
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFilter !== 'all' || selectedStatus !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Create the first proposal to get started'
                }
              </p>
              {selectedFilter === 'all' && selectedStatus === 'all' && (
                <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}