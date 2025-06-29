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
  AlertCircle
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';

export default function EntityPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!entityData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Entity data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Entity Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{entityData.name}</h1>
                <p className="text-gray-300 text-lg max-w-2xl">{entityData.description}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm text-emerald-400 font-medium">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">12 Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">1,240 ₳ Treasury</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Members"
          value="12"
          change="+2 this month"
          icon={Users}
          positive={true}
        />
        <StatCard
          title="Active Members"
          value="10"
          change="83% participation"
          icon={CheckCircle}
          positive={true}
        />
        <StatCard
          title="Pending Applications"
          value="3"
          change="Awaiting approval"
          icon={Clock}
          positive={false}
        />
        <StatCard
          title="Membership Fee"
          value={`${entityData.membershipFee} KES`}
          change="Monthly"
          icon={FileText}
          positive={true}
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
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-emerald-500/20">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Governance Model</p>
                  <p className="font-medium text-white capitalize">{entityData.governanceModel}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-cyan-500/20">
                  <FileText className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Voting Threshold</p>
                  <p className="font-medium text-white">{entityData.votingThreshold}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-purple-500/20">
                  <Settings className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Membership Fee</p>
                  <p className="font-medium text-white">{entityData.membershipFee} KES</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-lg font-medium text-white mb-4">Entity Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${entityData.enableKYC ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                    <span className="text-white">KYC Requirements</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-lg ${entityData.enableKYC ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {entityData.enableKYC ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${entityData.treasuryMultisig ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                    <span className="text-white">Multi-signature Treasury</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-lg ${entityData.treasuryMultisig ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {entityData.treasuryMultisig ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dashboard/entity/members" className="block">
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <Users className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Manage Members</p>
                        <p className="text-sm text-gray-400">View and manage member list</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </Link>
                
                <Link href="/dashboard/entity/settings" className="block">
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-500/20 rounded-xl">
                        <Settings className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Entity Settings</p>
                        <p className="text-sm text-gray-400">Configure governance rules</p>
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
                        <p className="font-medium text-white">View Analytics</p>
                        <p className="text-sm text-gray-400">Member participation metrics</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Member Activity */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Member Activity</h3>
              <div className="space-y-4">
                <MemberActivityItem
                  name="Sarah Kimani"
                  action="Joined the cooperative"
                  time="2 hours ago"
                  status="approved"
                />
                <MemberActivityItem
                  name="John Mwangi"
                  action="Submitted membership application"
                  time="1 day ago"
                  status="pending"
                />
                <MemberActivityItem
                  name="Mary Wanjiku"
                  action="Updated profile information"
                  time="3 days ago"
                  status="completed"
                />
                <MemberActivityItem
                  name="Peter Ochieng"
                  action="Completed KYC verification"
                  time="5 days ago"
                  status="approved"
                />
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href="/dashboard/entity/members">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                    View All Members
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
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

function MemberActivityItem({ 
  name, 
  action, 
  time, 
  status 
}: { 
  name: string; 
  action: string; 
  time: string; 
  status: 'approved' | 'pending' | 'completed';
}) {
  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-cyan-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20';
      case 'pending':
        return 'bg-yellow-500/20';
      case 'completed':
        return 'bg-cyan-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
      <div className={`p-2 rounded-xl ${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-gray-400">{action}</p>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}