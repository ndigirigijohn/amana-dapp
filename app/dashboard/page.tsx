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
  CheckCircle
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and has an entity
  useEffect(() => {
    const checkRequirements = async () => {
      setIsLoading(true);
      
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
        setEntityData(parsedEntityData);
      } catch (error) {
        console.error("Error parsing entity data:", error);
      }
      
      setIsLoading(false);
    };
    
    checkRequirements();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
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
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome to {entityData?.name || 'Your SACCO'}
            </h2>
            <p className="text-gray-300">
              Manage your decentralized cooperative with transparency and efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Main categories */}
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard 
          title="Entity"
          description="Manage your SACCO members and settings"
          icon={Building}
          href="/dashboard/entity"
        >
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Members"
              value="12"
              icon={Users}
            />
            <MetricCard
              label="Verified Members"
              value="8"
              icon={CheckCircle}
            />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Treasury"
          description="Monitor assets and financial operations"
          icon={Landmark}
          href="/dashboard/treasury"
        >
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricCard
              label="Balance"
              value="1,240 ₳"
              icon={Wallet}
            />
            <MetricCard
              label="Transactions"
              value="24"
              icon={Activity}
            />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Governance"
          description="Vote on proposals and participate in decisions"
          icon={FileCheck}
          href="/dashboard/governance"
        >
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricCard
              label="Active Proposals"
              value="3"
              icon={Clock}
            />
            <MetricCard
              label="Your Voting Power"
              value="8.5%"
              icon={TrendingUp}
            />
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/treasury/proposals" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <CreditCard className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Request Funds</p>
                      <p className="text-sm text-gray-400">Submit a treasury proposal</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
              
              <Link href="/dashboard/entity/members" className="block">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-xl">
                      <Users className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Invite Member</p>
                      <p className="text-sm text-gray-400">Add new cooperative member</p>
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
                      <p className="text-sm text-gray-400">Check performance metrics</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <ActivityItem
                title="New member approved"
                description="Sarah Kimani joined the cooperative"
                date="2 hours ago"
                icon={Users}
              />
              <ActivityItem
                title="Treasury proposal passed"
                description="Equipment purchase approved - 500 ₳"
                date="1 day ago"
                icon={CheckCircle}
              />
              <ActivityItem
                title="Monthly report generated"
                description="October financial summary available"
                date="3 days ago"
                icon={BarChart3}
              />
              <ActivityItem
                title="Governance vote started"
                description="Vote on membership fee adjustment"
                date="5 days ago"
                icon={FileCheck}
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link href="/dashboard/governance">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                  View All Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  children, 
  icon: Icon, 
  href 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl">
              <Icon className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl">
            <Link href={href}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-xl font-bold text-white">{value}</span>
    </div>
  );
}

function ActivityItem({ 
  title, 
  description, 
  date, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  date: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start space-x-4 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-2 rounded-xl">
        <Icon className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">
        {date}
      </div>
    </div>
  );
}