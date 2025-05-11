'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  Activity
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome to {entityData?.name || 'Your SACCO'}
        </h2>
        <p className="text-muted-foreground">
          Manage your decentralized cooperative with transparency and efficiency
        </p>
      </div>

      {/* Main categories */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard 
          title="Entity"
          description="Manage your SACCO members and settings"
          icon={Building}
          href="/dashboard/entity"
        >
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetricCard
              label="Total Members"
              value="12"
              icon={Users}
            />
            <MetricCard
              label="Verified Members"
              value="8"
              icon={FileCheck}
            />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Treasury"
          description="Monitor assets and financial operations"
          icon={Landmark}
          href="/dashboard/treasury"
        >
          <div className="mt-4 grid grid-cols-2 gap-2">
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
          description="Participate in decision-making processes"
          icon={FileCheck}
          href="/dashboard/governance"
        >
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetricCard
              label="Active Proposals"
              value="3"
              icon={FileCheck}
            />
            <MetricCard
              label="Voting Power"
              value="100%"
              icon={BarChart3}
            />
          </div>
        </DashboardCard>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events and updates from your SACCO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem
              title="New Member Joined"
              description="Sarah M. has joined your SACCO"
              date="Just now"
              icon={Users}
            />
            <ActivityItem
              title="Treasury Transaction"
              description="Deposit of 100 ₳ received"
              date="2 hours ago"
              icon={CreditCard}
            />
            <ActivityItem
              title="Governance Proposal"
              description="New proposal: 'Update membership fee'"
              date="1 day ago"
              icon={FileCheck}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
function DashboardCard({ 
  title, 
  description, 
  children, 
  icon: Icon,
  href 
}: { 
  title: string; 
  description: string; 
  children?: React.ReactNode;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-md">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={href}>
              <span className="sr-only sm:not-sr-only sm:inline-block">View</span>
              <ArrowRight className="h-4 w-4 sm:ml-2" />
            </Link>
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
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
    <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-xl font-semibold mt-1">{value}</span>
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
    <div className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="bg-primary/10 p-2 rounded-full">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {date}
      </div>
    </div>
  );
}