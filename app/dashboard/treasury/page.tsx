'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coins,
  BarChart3,
  Activity
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';

// Mock data for treasury transactions
const mockTransactions = [
  {
    id: 'tx_001',
    type: 'incoming',
    amount: 500,
    asset: 'ADA',
    from: 'Member Contributions',
    to: 'Treasury Wallet',
    timestamp: Date.now() - 3600000,
    status: 'confirmed',
    txHash: 'a1b2c3d4e5f6...',
    category: 'deposit'
  },
  {
    id: 'tx_002',
    type: 'outgoing',
    amount: 250,
    asset: 'ADA',
    from: 'Treasury Wallet',
    to: 'Equipment Purchase',
    timestamp: Date.now() - 7200000,
    status: 'confirmed',
    txHash: 'f6e5d4c3b2a1...',
    category: 'proposal'
  },
  {
    id: 'tx_003',
    type: 'incoming',
    amount: 100,
    asset: 'ADA',
    from: 'Sarah Kimani',
    to: 'Treasury Wallet',
    timestamp: Date.now() - 86400000,
    status: 'confirmed',
    txHash: 'z9y8x7w6v5u4...',
    category: 'membership'
  },
  {
    id: 'tx_004',
    type: 'outgoing',
    amount: 300,
    asset: 'ADA',
    from: 'Treasury Wallet',
    to: 'Emergency Fund',
    timestamp: Date.now() - 172800000,
    status: 'pending',
    txHash: 'u4v5w6x7y8z9...',
    category: 'proposal'
  }
];

export default function TreasuryPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalBalance = 1240; // Mock balance in ADA
  const totalAssets = 3; // Mock number of different assets
  const pendingTransactions = mockTransactions.filter(tx => tx.status === 'pending').length;
  const monthlyIncome = 850; // Mock monthly income
  const monthlyExpenses = 420; // Mock monthly expenses

  const filteredTransactions = selectedFilter === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.category === selectedFilter);

  return (
    <div className="space-y-8">
      {/* Treasury Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Treasury Management</h1>
              <p className="text-gray-300 text-lg">Monitor and manage your cooperative's financial assets</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Treasury Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TreasuryStatCard
          title="Total Balance"
          value={`${totalBalance} ₳`}
          change="+5.2% this month"
          icon={Wallet}
          positive={true}
        />
        <TreasuryStatCard
          title="Monthly Income"
          value={`${monthlyIncome} ₳`}
          change="From member contributions"
          icon={TrendingUp}
          positive={true}
        />
        <TreasuryStatCard
          title="Monthly Expenses"
          value={`${monthlyExpenses} ₳`}
          change="Operational costs"
          icon={TrendingDown}
          positive={false}
        />
        <TreasuryStatCard
          title="Pending Transactions"
          value={`${pendingTransactions}`}
          change="Awaiting approval"
          icon={Clock}
          positive={false}
        />
      </div>

      {/* Treasury Overview & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asset Breakdown */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Asset Breakdown</h3>
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              <AssetItem
                name="Cardano (ADA)"
                amount="1,240"
                percentage="85%"
                value="$1,860"
                change="+2.3%"
                positive={true}
              />
              <AssetItem
                name="Emergency Reserve"
                amount="180"
                percentage="12%"
                value="$270"
                change="+0.8%"
                positive={true}
              />
              <AssetItem
                name="Operational Fund"
                amount="45"
                percentage="3%"
                value="$67"
                change="-1.2%"
                positive={false}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/treasury/proposals" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Plus className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Create Proposal</p>
                      <p className="text-sm text-gray-400">Request fund allocation</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Generate Report</p>
                    <p className="text-sm text-gray-400">Financial summary</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Audit Trail</p>
                    <p className="text-sm text-gray-400">View all transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="proposal">Proposals</option>
                  <option value="membership">Membership</option>
                </select>
              </div>
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl">
                View All
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TreasuryStatCard({ 
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

function AssetItem({ 
  name, 
  amount, 
  percentage, 
  value, 
  change, 
  positive 
}: { 
  name: string; 
  amount: string; 
  percentage: string; 
  value: string; 
  change: string; 
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Coins className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-400">{amount} ₳ • {percentage}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-white">{value}</p>
        <p className={`text-sm ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </p>
      </div>
    </div>
  );
}

function TransactionItem({ 
  transaction, 
  formatDate 
}: { 
  transaction: any; 
  formatDate: (timestamp: number) => string;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20';
      case 'pending':
        return 'bg-yellow-500/20';
      case 'failed':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/20 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-xl ${getStatusColor(transaction.status)}`}>
          {transaction.type === 'incoming' ? (
            <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-cyan-400" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-white">
              {transaction.type === 'incoming' ? 'Received' : 'Sent'}
            </p>
            {getStatusIcon(transaction.status)}
          </div>
          <p className="text-sm text-gray-400">
            {transaction.type === 'incoming' ? transaction.from : transaction.to}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${transaction.type === 'incoming' ? 'text-emerald-400' : 'text-white'}`}>
          {transaction.type === 'incoming' ? '+' : '-'}{transaction.amount} ₳
        </p>
        <p className="text-sm text-gray-400">{formatDate(transaction.timestamp)}</p>
      </div>
    </div>
  );
}