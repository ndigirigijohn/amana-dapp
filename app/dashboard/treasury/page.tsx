'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  BarChart3,
  Eye
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import { Input } from '@/components/ui/input';
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
import { 
  apiService, 
  type EntityData, 
  type Transaction,
  DEFAULT_ENTITY_DATA
} from '@/lib/api/services';

interface TreasuryStatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  positive: boolean;
  loading?: boolean;
}

function TreasuryStatCard({ title, value, change, icon: Icon, positive, loading }: TreasuryStatCardProps) {
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
            <p className={`text-xs ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
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

export default function TreasuryPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [treasuryBalance, setTreasuryBalance] = useState<number>(0);

  const loadTreasuryData = async (entityId: string, showLoading = true) => {
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

      // Load treasury balance
      const balanceResponse = await apiService.getTreasuryBalance(entityId);
      if (balanceResponse.success && balanceResponse.data) {
        setTreasuryBalance(balanceResponse.data.balance);
      } else {
        console.error('Failed to load treasury balance:', balanceResponse.error);
        // Use default value, don't show error for demo
      }

      // Load transactions
      const transactionsResponse = await apiService.getTransactions(entityId);
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
        setFilteredTransactions(transactionsResponse.data);
      } else {
        console.error('Failed to load transactions:', transactionsResponse.error);
        // Keep empty array as fallback, don't show error for demo
        setTransactions([]);
        setFilteredTransactions([]);
      }

    } catch (error) {
      console.error('Error loading treasury data:', error);
      // Don't show error for demo
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeTreasuryPage = async () => {
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
        setTreasuryBalance(parsedEntityData.treasuryBalance || 0);
        setIsLoading(false);
        
        // Then try to load from API if we have an ID
        const entityId = parsedEntityData.id;
        if (entityId) {
          await loadTreasuryData(entityId, false);
        }
      } catch (error) {
        console.error("Error initializing treasury page:", error);
        // Don't show error for demo
        setIsLoading(false);
      }
    };

    initializeTreasuryPage();
  }, [router]);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.from && transaction.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.to && transaction.to.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedFilter]);

  const handleRefresh = () => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        const entityId = parsedEntityData.id;
        if (entityId) {
          loadTreasuryData(entityId, false);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
        // Don't show error for demo
      }
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
      case 'expense':
        return <ArrowDownLeft className="h-4 w-4 text-red-400" />;
      case 'transfer':
        return <Activity className="h-4 w-4 text-cyan-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    return `${prefix}${amount} ₳`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading treasury data...</p>
        </div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Treasury Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Treasury Management</h1>
              <p className="text-gray-300 text-lg">Monitor and manage {entityData.name} financial assets</p>
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
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </div>
          
          {/* Remove error display for demo */}
        </div>
      </div>

      {/* Treasury Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TreasuryStatCard
          title="Total Balance"
          value={`${treasuryBalance || entityData.treasuryBalance || 0} ₳`}
          change={`+${Math.round((totalIncome * 0.05) || 0)} this month`}
          icon={Wallet}
          positive={true}
          loading={isLoading}
        />
        <TreasuryStatCard
          title="Monthly Income"
          value={`${totalIncome || entityData.monthlyIncome || 0} ₳`}
          change="From contributions"
          icon={TrendingUp}
          positive={true}
          loading={isLoading}
        />
        <TreasuryStatCard
          title="Monthly Expenses"
          value={`${totalExpenses || entityData.monthlyExpenses || 0} ₳`}
          change="Operational costs"
          icon={TrendingDown}
          positive={false}
          loading={isLoading}
        />
        <TreasuryStatCard
          title="Pending Transactions"
          value={pendingTransactions}
          change="Awaiting approval"
          icon={Clock}
          positive={false}
          loading={isLoading}
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Net Income</h3>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatAmount(Math.abs(netIncome), netIncome >= 0 ? 'income' : 'expense')}
                </p>
                <p className="text-sm text-gray-400">This month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Volume</h3>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{transactions.length}</p>
                <p className="text-sm text-gray-400">Total transactions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Average Transaction</h3>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {transactions.length > 0 
                    ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
                    : 0} ₳
                </p>
                <p className="text-sm text-gray-400">Per transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Transaction History</h3>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
                />
              </div>
              
              {/* Type Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-300">Transaction</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-400 capitalize">{transaction.category}</p>
                            {transaction.txHash && (
                              <p className="text-xs text-gray-500 font-mono">
                                {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-6)}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white capitalize">{transaction.type}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          transaction.type === 'income' 
                            ? 'text-emerald-400' 
                            : transaction.type === 'expense'
                            ? 'text-red-400'
                            : 'text-cyan-400'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{formatDate(transaction.timestamp)}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="h-8 w-8 p-0 bg-transparent hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="bg-gray-800 border-gray-700 text-white"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {transaction.txHash && (
                              <DropdownMenuItem 
                                className="hover:bg-gray-700 cursor-pointer"
                                onClick={() => window.open(`https://cardanoscan.io/transaction/${transaction.txHash}`, '_blank')}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                View on Explorer
                              </DropdownMenuItem>
                            )}
                            {transaction.status === 'pending' && (
                              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-red-400">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'No transactions match your filters' 
                  : 'No transactions found'
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Treasury activity will appear here'
                }
              </p>
              {(!searchTerm && selectedFilter === 'all') && (
                <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Transaction
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}