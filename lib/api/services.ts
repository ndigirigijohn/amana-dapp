// lib/api/services.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EntityData {
  id: string;
  name: string;
  description: string;
  type: string;
  membershipFee: number;
  totalMembers: number;
  activeMembers: number;
  pendingApplications: number;
  treasuryBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  complianceScore: number;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  governanceTokens: number;
  location?: string;
  contactEmail?: string;
}

export interface DashboardStats {
  totalEntities: number;
  totalMembers: number;
  totalAssets: number;
  activeGovernance: number;
  monthlyGrowth: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'transaction' | 'governance' | 'member' | 'treasury';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  amount?: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: string;
  shares: number;
  kycVerified: boolean;
  joinedDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'active' | 'passed' | 'rejected' | 'draft';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  startTime: string;
  endTime: string;
  proposer: string;
  quorumRequired: number;
  executionDelay?: number;
}

// Default values to show while loading
export const DEFAULT_ENTITY_DATA: EntityData = {
  id: '',
  name: 'Loading...',
  description: 'Loading entity details...',
  type: 'SACCO',
  membershipFee: 0,
  totalMembers: 0,
  activeMembers: 0,
  pendingApplications: 0,
  treasuryBalance: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  complianceScore: 0,
  createdAt: '',
  updatedAt: '',
  walletAddress: '',
  governanceTokens: 0,
};

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  totalEntities: 0,
  totalMembers: 0,
  totalAssets: 0,
  activeGovernance: 0,
  monthlyGrowth: 0,
  recentActivity: [],
};

class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'API request failed',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Entity APIs
  async getEntityData(entityId: string): Promise<ApiResponse<EntityData>> {
    return this.request<EntityData>(`/entities/${entityId}`);
  }

  async updateEntityData(entityId: string, data: Partial<EntityData>): Promise<ApiResponse<EntityData>> {
    return this.request<EntityData>(`/entities/${entityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Dashboard APIs
  async getDashboardStats(entityId: string): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(`/entities/${entityId}/dashboard`);
  }

  async getRecentActivity(entityId: string, limit: number = 10): Promise<ApiResponse<ActivityItem[]>> {
    return this.request<ActivityItem[]>(`/entities/${entityId}/activity?limit=${limit}`);
  }

  // Member APIs
  async getMembers(entityId: string): Promise<ApiResponse<Member[]>> {
    return this.request<Member[]>(`/entities/${entityId}/members`);
  }

  async addMember(entityId: string, memberData: Omit<Member, 'id' | 'joinedDate' | 'lastActivity'>): Promise<ApiResponse<Member>> {
    return this.request<Member>(`/entities/${entityId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateMember(entityId: string, memberId: string, data: Partial<Member>): Promise<ApiResponse<Member>> {
    return this.request<Member>(`/entities/${entityId}/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeMember(entityId: string, memberId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/entities/${entityId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Treasury APIs
  async getTreasuryBalance(entityId: string): Promise<ApiResponse<{ balance: number; assets: any[] }>> {
    return this.request<{ balance: number; assets: any[] }>(`/entities/${entityId}/treasury/balance`);
  }

  async getTransactions(entityId: string, limit: number = 50): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>(`/entities/${entityId}/treasury/transactions?limit=${limit}`);
  }

  async createTransaction(entityId: string, transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/entities/${entityId}/treasury/transactions`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // Governance APIs
  async getGovernanceProposals(entityId: string): Promise<ApiResponse<GovernanceProposal[]>> {
    return this.request<GovernanceProposal[]>(`/entities/${entityId}/governance/proposals`);
  }

  async createProposal(entityId: string, proposal: Omit<GovernanceProposal, 'id' | 'votesFor' | 'votesAgainst' | 'totalVotes'>): Promise<ApiResponse<GovernanceProposal>> {
    return this.request<GovernanceProposal>(`/entities/${entityId}/governance/proposals`, {
      method: 'POST',
      body: JSON.stringify(proposal),
    });
  }

  async voteOnProposal(entityId: string, proposalId: string, vote: 'for' | 'against'): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/entities/${entityId}/governance/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  }

  // Blockchain APIs
  async getWalletBalance(walletAddress: string): Promise<ApiResponse<{ balance: number; tokens: any[] }>> {
    return this.request<{ balance: number; tokens: any[] }>(`/blockchain/wallet/${walletAddress}/balance`);
  }

  async submitTransaction(entityId: string, txData: any): Promise<ApiResponse<{ txHash: string }>> {
    return this.request<{ txHash: string }>(`/entities/${entityId}/blockchain/submit`, {
      method: 'POST',
      body: JSON.stringify(txData),
    });
  }

  async getTransactionStatus(txHash: string): Promise<ApiResponse<{ status: string; confirmations: number }>> {
    return this.request<{ status: string; confirmations: number }>(`/blockchain/tx/${txHash}/status`);
  }
}

export const apiService = new ApiService();