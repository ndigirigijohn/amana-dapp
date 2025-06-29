'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Landmark, 
  FileCheck, 
  Users, 
  ArrowRight,
  CreditCard,
  BarChart3,
  Wallet,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';
import { 
  apiService, 
  type EntityData, 
  type DashboardStats, 
  type ActivityItem,
  DEFAULT_ENTITY_DATA,
  DEFAULT_DASHBOARD_STATS
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

function ActivityItem({ item }: { item: ActivityItem }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction': return Wallet;
      case 'governance': return BarChart3;
      case 'member': return Users;
      case 'treasury': return Building;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const Icon = getIcon(item.type);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      <div className="p-2 bg-emerald-500/20 rounded-lg">
        <Icon className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{item.title}</p>
        <p className="text-sm text-gray-400">{item.description}</p>
        <p className="text-xs text-gray-500">
          {new Date(item.timestamp).toLocaleString()}
        </p>
      </div>
      <div className={`text-sm ${getStatusColor(item.status)}`}>
        {item.status}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(DEFAULT_DASHBOARD_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data from APIs
  const loadDashboardData = async (entityId: string, showLoading = true) => {
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
        // Keep default values and show error
        setError(entityResponse.error || 'Failed to load entity data');
      }

      // Load dashboard stats
      const statsResponse = await apiService.getDashboardStats(entityId);
      if (statsResponse.success && statsResponse.data) {
        setDashboardStats(statsResponse.data);
      } else {
        console.error('Failed to load dashboard stats:', statsResponse.error);
        // Keep default values
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Check if user is logged in and has an entity
  useEffect(() => {
    const checkRequirements = async () => {
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
          await loadDashboardData(entityId);
        } else {
          // Fallback to localStorage data if no ID
          setEntityData(parsedEntityData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing entity data:", error);
        setError('Invalid entity data');
        setIsLoading(false);
      }
    };
    
    checkRequirements();
  }, [router]);

  const handleRefresh = () => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        const entityId = parsedEntityData.id;
        if (entityId) {
          loadDashboardData(entityId, false);
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
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Welcome to {entityData?.name || 'Your SACCO'}
                </h2>
                <p className="text-gray-300">
                  Manage your decentralized cooperative with transparency and efficiency
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={entityData.totalMembers || 0}
          change={`+${Math.floor((entityData.totalMembers || 0) * 0.1)} this month`}
          icon={Users}
          positive={true}
          loading={isLoading}
        />
        <StatCard
          title="Treasury Balance"
          value={`${entityData.treasuryBalance || 0} ₳`}
          change={`+${entityData.monthlyIncome || 0} this month`}
          icon={Wallet}
          positive={true}
          loading={isLoading}
        />
        <StatCard
          title="Active Proposals"
          value={dashboardStats.activeGovernance || 0}
          change="Awaiting votes"
          icon={BarChart3}
          positive={false}
          loading={isLoading}
        />
        <StatCard
          title="Compliance Score"
          value={`${entityData.complianceScore || 0}%`}
          change="Excellent rating"
          icon={CheckCircle}
          positive={true}
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <Link href="/dashboard/entity" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Building className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Entity Overview</p>
                      <p className="text-sm text-gray-400">View entity details and stats</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/treasury" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                      <Landmark className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Treasury</p>
                      <p className="text-sm text-gray-400">Manage funds and transactions</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
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
                      <p className="text-sm text-gray-400">Vote on proposals</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/compliance" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <FileCheck className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Compliance</p>
                      <p className="text-sm text-gray-400">Reports and auditing</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {dashboardStats.recentActivity.length > 0 ? (
                dashboardStats.recentActivity.slice(0, 5).map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-sm text-gray-500">Activity will appear here as it happens</p>
                </div>
              )}
            </div>
            
            {dashboardStats.recentActivity.length > 5 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href="/dashboard/activity">
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl">
                    View All Activity
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}