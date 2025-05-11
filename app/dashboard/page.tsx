'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedWalletConnection } from '@/lib/common';

export default function DashboardPage() {
  const router = useRouter();

  // Check if user is logged in and has an entity
  useEffect(() => {
    const walletConnection = getSavedWalletConnection();
    const currentEntity = localStorage.getItem('amana_current_entity');
    
    if (!walletConnection) {
      router.push('/entity-registry');
      return;
    }
    
    if (!currentEntity) {
      router.push('/entity-registry');
      return;
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Dashboard is under construction. You have successfully created or restored an entity
        and connected your wallet!
      </p>
    </div>
  );
}