'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Shield, 
  Wallet,
  ArrowRight,
  Edit,
  UserPlus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  MapPin,
  Mail,
  Calendar
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';
import { 
  apiService, 
  type EntityData, 
  type Member,
  DEFAULT_ENTITY_DATA
} from '@/lib/api/services';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  positive: boolean;
  loading?: boolean;
}

function StatCard({ title, value, change, icon: Icon, positive, loading }: StatCardProps) {
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

export default function EntityPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const loadEntityData = async (entityId: string, showLoading = true) => {
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
        
        // Load wallet balance if wallet address exists
        if (entityResponse.data.walletAddress) {
          const balanceResponse = await apiService.getWalletBalance(entityResponse.data.walletAddress);
          if (balanceResponse.success && balanceResponse.data) {
            setWalletBalance(balanceResponse.data.balance);
          }
        }
      } else {
        setError(entityResponse.error || 'Failed to load entity data');
      }

      // Load members data
      const membersResponse = await apiService.getMembers(entityId);
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      } else {
        console.error('Failed to load members:', membersResponse.error);
      }

    } catch (error) {
      console.error('Error loading entity data:', error);
      setError('Failed to load entity data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const loadEntityPage = async () => {
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
        const entityId = parsedEntityData.id;
        
        if (entityId) {
          await loadEntityData(entityId);
        } else {
          // Fallback to localStorage data
          setEntityData(parsedEntityData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading entity data:", error);
        setError('Invalid entity data');
        setIsLoading(false);
      }
    };

    loadEntityPage();
  }, [router]);

  const handleRefresh = () => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        const entityId = parsedEntityData.id;
        if (entityId) {
          loadEntityData(entityId, false);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading entity data...</p>
        </div>
      </div>
    );
  }

  if (error && !entityData.name) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-emerald-500 hover:bg-emerald-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const participationRate = entityData.totalMembers > 0 
    ? Math.round((activeMembers / entityData.totalMembers) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Entity Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl">
                  <Building className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{entityData.name}</h1>
                  <p className="text-gray-300 text-lg">{entityData.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {entityData.location && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{entityData.location}</span>
                  </div>
                )}
                {entityData.contactEmail && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{entityData.contactEmail}</span>
                  </div>
                )}
                {entityData.createdAt && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Since {new Date(entityData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
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
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Link href="/dashboard/entity/members">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Members"
          value={entityData.totalMembers || members.length}
          change={`+${pendingMembers} pending`}
          icon={Users}
          positive={true}
          loading={isLoading}
        />
        <StatCard
          title="Active Members"
          value={activeMembers}
          change={`${participationRate}% participation`}
          icon={CheckCircle}
          positive={participationRate > 80}
          loading={isLoading}
        />
        <StatCard
          title="Treasury Balance"
          value={`${walletBalance || entityData.treasuryBalance || 0} ₳`}
          change="On-chain balance"
          icon={Wallet}
          positive={true}
          loading={isLoading}
        />
        <StatCard
          title="Membership Fee"
          value={`${entityData.membershipFee || 0} KES`}
          change="Monthly"
          icon={FileText}
          positive={true}
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Entity Details */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Entity Details</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Entity Type</span>
                <span className="text-white font-medium">{entityData.type || 'SACCO'}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Wallet Address</span>
                <span className="text-white font-mono text-sm">
                  {entityData.walletAddress 
                    ? `${entityData.walletAddress.slice(0, 12)}...${entityData.walletAddress.slice(-8)}`
                    : 'Not connected'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Governance Tokens</span>
                <span className="text-white font-medium">{entityData.governanceTokens || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Compliance Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${entityData.complianceScore || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{entityData.complianceScore || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <Link href="/dashboard/entity/members" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Manage Members</p>
                      <p className="text-sm text-gray-400">{members.length} total members</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/treasury" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                      <Wallet className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Treasury</p>
                      <p className="text-sm text-gray-400">
                        {walletBalance || entityData.treasuryBalance || 0} ₳ balance
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/entity/settings" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <Settings className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Entity Settings</p>
                      <p className="text-sm text-gray-400">Configure governance rules</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/governance" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Governance</p>
                      <p className="text-sm text-gray-400">Active proposals</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/compliance" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-red-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Shield className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Compliance</p>
                      <p className="text-sm text-gray-400">{entityData.complianceScore || 0}% score</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Financial Overview</h3>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Monthly Income</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {entityData.monthlyIncome || 0} ₳
              </p>
              <p className="text-xs text-emerald-400">From member contributions</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Monthly Expenses</span>
                <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
              </div>
              <p className="text-2xl font-bold text-white">
                {entityData.monthlyExpenses || 0} ₳
              </p>
              <p className="text-xs text-red-400">Operational costs</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Net Income</span>
                <BarChart3 className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {(entityData.monthlyIncome || 0) - (entityData.monthlyExpenses || 0)} ₳
              </p>
              <p className="text-xs text-cyan-400">This month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}