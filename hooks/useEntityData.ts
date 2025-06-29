// lib/hooks/useEntityData.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  apiService, 
  type EntityData, 
  type DashboardStats, 
  type Member,
  type Transaction,
  type GovernanceProposal,
  DEFAULT_ENTITY_DATA,
  DEFAULT_DASHBOARD_STATS
} from '@/lib/api/services';

interface UseEntityDataReturn {
  entityData: EntityData;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateEntity: (data: Partial<EntityData>) => Promise<boolean>;
}

export function useEntityData(entityId: string | null): UseEntityDataReturn {
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntityData = useCallback(async (showLoading = true) => {
    if (!entityId) {
      setError('No entity ID provided');
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getEntityData(entityId);
      if (response.success && response.data) {
        setEntityData(response.data);
      } else {
        setError(response.error || 'Failed to load entity data');
        // Keep default values on error
      }
    } catch (error) {
      console.error('Error loading entity data:', error);
      setError('Failed to load entity data');
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  const updateEntity = useCallback(async (data: Partial<EntityData>): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.updateEntityData(entityId, data);
      if (response.success && response.data) {
        setEntityData(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to update entity');
        return false;
      }
    } catch (error) {
      console.error('Error updating entity:', error);
      setError('Failed to update entity');
      return false;
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId) {
      loadEntityData();
    }
  }, [entityId, loadEntityData]);

  return {
    entityData,
    isLoading,
    error,
    refresh: () => loadEntityData(false),
    updateEntity,
  };
}

interface UseDashboardStatsReturn {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardStats(entityId: string | null): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_DASHBOARD_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (showLoading = true) => {
    if (!entityId) {
      setError('No entity ID provided');
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getDashboardStats(entityId);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId) {
      loadStats();
    }
  }, [entityId, loadStats]);

  return {
    stats,
    isLoading,
    error,
    refresh: () => loadStats(false),
  };
}

interface UseMembersReturn {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addMember: (memberData: Omit<Member, 'id' | 'joinedDate' | 'lastActivity'>) => Promise<boolean>;
  updateMember: (memberId: string, data: Partial<Member>) => Promise<boolean>;
  removeMember: (memberId: string) => Promise<boolean>;
}

export function useMembers(entityId: string | null): UseMembersReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async (showLoading = true) => {
    if (!entityId) {
      setError('No entity ID provided');
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getMembers(entityId);
      if (response.success && response.data) {
        setMembers(response.data);
      } else {
        setError(response.error || 'Failed to load members');
        setMembers([]);
      }
    } catch (error) {
      console.error('Error loading members:', error);
      setError('Failed to load members');
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  const addMember = useCallback(async (memberData: Omit<Member, 'id' | 'joinedDate' | 'lastActivity'>): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.addMember(entityId, memberData);
      if (response.success && response.data) {
        setMembers(prev => [...prev, response.data!]);
        return true;
      } else {
        setError(response.error || 'Failed to add member');
        return false;
      }
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member');
      return false;
    }
  }, [entityId]);

  const updateMember = useCallback(async (memberId: string, data: Partial<Member>): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.updateMember(entityId, memberId, data);
      if (response.success && response.data) {
        setMembers(prev => prev.map(m => m.id === memberId ? response.data! : m));
        return true;
      } else {
        setError(response.error || 'Failed to update member');
        return false;
      }
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Failed to update member');
      return false;
    }
  }, [entityId]);

  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.removeMember(entityId, memberId);
      if (response.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
        return true;
      } else {
        setError(response.error || 'Failed to remove member');
        return false;
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setError('Failed to remove member');
      return false;
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId) {
      loadMembers();
    }
  }, [entityId, loadMembers]);

  return {
    members,
    isLoading,
    error,
    refresh: () => loadMembers(false),
    addMember,
    updateMember,
    removeMember,
  };
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => Promise<boolean>;
}

export function useTransactions(entityId: string | null): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async (showLoading = true) => {
    if (!entityId) {
      setError('No entity ID provided');
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getTransactions(entityId);
      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        setError(response.error || 'Failed to load transactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  const createTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.createTransaction(entityId, transaction);
      if (response.success && response.data) {
        setTransactions(prev => [response.data!, ...prev]);
        return true;
      } else {
        setError(response.error || 'Failed to create transaction');
        return false;
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction');
      return false;
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId) {
      loadTransactions();
    }
  }, [entityId, loadTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refresh: () => loadTransactions(false),
    createTransaction,
  };
}

interface UseGovernanceReturn {
  proposals: GovernanceProposal[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProposal: (proposal: Omit<GovernanceProposal, 'id' | 'votesFor' | 'votesAgainst' | 'totalVotes'>) => Promise<boolean>;
  voteOnProposal: (proposalId: string, vote: 'for' | 'against') => Promise<boolean>;
}

export function useGovernance(entityId: string | null): UseGovernanceReturn {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProposals = useCallback(async (showLoading = true) => {
    if (!entityId) {
      setError('No entity ID provided');
      setIsLoading(false);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getGovernanceProposals(entityId);
      if (response.success && response.data) {
        setProposals(response.data);
      } else {
        setError(response.error || 'Failed to load proposals');
        setProposals([]);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
      setError('Failed to load proposals');
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  const createProposal = useCallback(async (proposal: Omit<GovernanceProposal, 'id' | 'votesFor' | 'votesAgainst' | 'totalVotes'>): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.createProposal(entityId, proposal);
      if (response.success && response.data) {
        setProposals(prev => [response.data!, ...prev]);
        return true;
      } else {
        setError(response.error || 'Failed to create proposal');
        return false;
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      setError('Failed to create proposal');
      return false;
    }
  }, [entityId]);

  const voteOnProposal = useCallback(async (proposalId: string, vote: 'for' | 'against'): Promise<boolean> => {
    if (!entityId) return false;

    try {
      const response = await apiService.voteOnProposal(entityId, proposalId, vote);
      if (response.success) {
        // Refresh proposals to get updated vote counts
        await loadProposals(false);
        return true;
      } else {
        setError(response.error || 'Failed to vote on proposal');
        return false;
      }
    } catch (error) {
      console.error('Error voting on proposal:', error);
      setError('Failed to vote on proposal');
      return false;
    }
  }, [entityId, loadProposals]);

  useEffect(() => {
    if (entityId) {
      loadProposals();
    }
  }, [entityId, loadProposals]);

  return {
    proposals,
    isLoading,
    error,
    refresh: () => loadProposals(false),
    createProposal,
    voteOnProposal,
  };
}

// Utility hook to get entity ID from localStorage
export function useEntityId(): string | null {
  const [entityId, setEntityId] = useState<string | null>(null);

  useEffect(() => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        setEntityId(parsedEntityData.id || null);
      } catch (error) {
        console.error('Error parsing entity data:', error);
        setEntityId(null);
      }
    }
  }, []);

  return entityId;
}