'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  ArrowDown, 
  ArrowUp, 
  Plus, 
  Download, 
  Upload,
  Wallet,
  CreditCard,
  BarChart3,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Example transaction data - in a real app this would come from your backend
const mockTransactions = [
  {
    id: "tx-1",
    type: "deposit",
    amount: "250",
    description: "Initial contribution",
    date: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    status: "completed"
  },
  {
    id: "tx-2",
    type: "withdrawal",
    amount: "50",
    description: "Operating expenses",
    date: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    status: "completed"
  },
  {
    id: "tx-3",
    type: "deposit",
    amount: "100",
    description: "Monthly contribution",
    date: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    status: "completed"
  },
  {
    id: "tx-4",
    type: "withdrawal",
    amount: "75",
    description: "Loan disbursement",
    date: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    status: "pending"
  }
];

export default function TreasuryPage() {
  const [entityData, setEntityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load entity data from local storage
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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

  return (
    <div className="space-y-6">
      {/* Treasury summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBalance} ₳</div>
            <p className="text-xs text-muted-foreground">
              + 350 ₳ from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              Including native tokens and NFTs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting required signatures
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required Signatures</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entityData?.treasuryMultisig ? entityData.treasurySignatures : 1}
            </div>
            <p className="text-xs text-muted-foreground">
              {entityData?.treasuryMultisig 
                ? "Multi-signature treasury enabled" 
                : "Single signature treasury"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Treasury actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 gap-2">
          <Upload className="h-4 w-4" />
          Contribute Funds
        </Button>
        <Button className="flex-1 gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Request Withdrawal
        </Button>
        <Button className="flex-1 gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest financial activities in your SACCO
            </CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/treasury/transactions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "deposit" ? (
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-red-500" />
                      )}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "deposit" ? "+" : "-"}{transaction.amount} ₳
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        transaction.status === "completed" 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }
                    >
                      {transaction.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Treasury assets */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Holdings</CardTitle>
          <CardDescription>
            All financial assets in your treasury
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Policy ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Estimated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ADA asset */}
              <TableRow>
                <TableCell className="font-medium">ADA</TableCell>
                <TableCell className="font-mono text-xs">lovelace</TableCell>
                <TableCell>{totalBalance} ₳</TableCell>
                <TableCell className="text-right">${(totalBalance * 0.45).toFixed(2)}</TableCell>
              </TableRow>
              
              {/* Example token assets */}
              <TableRow>
                <TableCell className="font-medium">SACCO Token</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">
                  a1b2c3d4e5f6g7h8i9j0...
                </TableCell>
                <TableCell>1,000</TableCell>
                <TableCell className="text-right">$100.00</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">DJED</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">
                  8a1b2c3d4e5f6g7h8i9j...
                </TableCell>
                <TableCell>50</TableCell>
                <TableCell className="text-right">$50.00</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Governance NFT</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">
                  9a1b2c3d4e5f6g7h8i9j...
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t">
          <div className="flex justify-between w-full items-center">
            <span className="text-muted-foreground text-sm">Total Estimated Value</span>
            <span className="font-bold">${((totalBalance * 0.45) + 150).toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}