'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Download,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
  Mail,
  User,
  Shield
} from 'lucide-react';
import { getSavedWalletConnection } from '@/lib/common';
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
  type Member, 
  type EntityData,
  DEFAULT_ENTITY_DATA
} from '@/lib/api/services';

export default function MembersPage() {
  const router = useRouter();
  const [entityData, setEntityData] = useState<EntityData>(DEFAULT_ENTITY_DATA);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadMembersData = async (entityId: string, showLoading = true) => {
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
      }

      // Load members
      const membersResponse = await apiService.getMembers(entityId);
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
        setFilteredMembers(membersResponse.data);
      } else {
        setError(membersResponse.error || 'Failed to load members');
        // Set empty array as fallback
        setMembers([]);
        setFilteredMembers([]);
      }

    } catch (error) {
      console.error('Error loading members data:', error);
      setError('Failed to load members data');
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
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
          await loadMembersData(entityId);
        } else {
          // Fallback to localStorage
          setEntityData(parsedEntityData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing members page:", error);
        setError('Invalid entity data');
        setIsLoading(false);
      }
    };

    initializePage();
  }, [router]);

  // Filter members based on search and filters
  useEffect(() => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(member => member.role.toLowerCase() === selectedFilter.toLowerCase());
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(member => member.status === selectedStatus);
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, selectedFilter, selectedStatus]);

  const handleRefresh = () => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (currentEntityData) {
      try {
        const parsedEntityData = JSON.parse(currentEntityData);
        const entityId = parsedEntityData.id;
        if (entityId) {
          loadMembersData(entityId, false);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }
  };

  const handleMemberAction = async (memberId: string, action: 'approve' | 'reject' | 'remove') => {
    const currentEntityData = localStorage.getItem('amana_current_entity');
    if (!currentEntityData) return;

    try {
      const parsedEntityData = JSON.parse(currentEntityData);
      const entityId = parsedEntityData.id;
      if (!entityId) return;

      let response;
      switch (action) {
        case 'approve':
          response = await apiService.updateMember(entityId, memberId, { status: 'active' });
          break;
        case 'reject':
          response = await apiService.removeMember(entityId, memberId);
          break;
        case 'remove':
          response = await apiService.removeMember(entityId, memberId);
          break;
      }

      if (response.success) {
        // Refresh members list
        await loadMembersData(entityId, false);
      } else {
        setError(response.error || `Failed to ${action} member`);
      }
    } catch (error) {
      console.error(`Error ${action}ing member:`, error);
      setError(`Failed to ${action} member`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const kycVerifiedMembers = members.filter(m => m.kycVerified).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
              <p className="text-gray-300 text-lg">Manage {entityData.name} membership</p>
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
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-white">{totalMembers}</p>
                <p className="text-xs text-emerald-400">Registered</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Members</p>
                <p className="text-2xl font-bold text-white">{activeMembers}</p>
                <p className="text-xs text-emerald-400">
                  {totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}% of total
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Applications</p>
                <p className="text-2xl font-bold text-white">{pendingMembers}</p>
                <p className="text-xs text-orange-400">Awaiting approval</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <User className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">KYC Verified</p>
                <p className="text-2xl font-bold text-white">{kycVerifiedMembers}</p>
                <p className="text-xs text-cyan-400">
                  {totalMembers > 0 ? Math.round((kycVerifiedMembers / totalMembers) * 100) : 0}% verified
                </p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Members</h3>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
                />
              </div>
              
              {/* Role Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Roles</option>
                <option value="chairperson">Chairperson</option>
                <option value="treasurer">Treasurer</option>
                <option value="secretary">Secretary</option>
                <option value="member">Member</option>
              </select>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-300">Member</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Shares</TableHead>
                    <TableHead className="text-gray-300">KYC</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.email}</p>
                            <p className="text-xs text-gray-500 font-mono">
                              {truncateAddress(member.walletAddress)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white capitalize">{member.role}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-white">{member.shares}</span>
                      </TableCell>
                      <TableCell>
                        {member.kycVerified ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{formatDate(member.joinedDate)}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.status)}
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
                            <DropdownMenuItem 
                              className="hover:bg-gray-700 cursor-pointer"
                              onClick={() => {/* View member details */}}
                            >
                              <User className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="hover:bg-gray-700 cursor-pointer"
                              onClick={() => {/* Edit member */}}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            {member.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  className="hover:bg-gray-700 cursor-pointer text-emerald-400"
                                  onClick={() => handleMemberAction(member.id, 'approve')}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="hover:bg-gray-700 cursor-pointer text-red-400"
                                  onClick={() => handleMemberAction(member.id, 'reject')}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {member.status === 'active' && (
                              <DropdownMenuItem 
                                className="hover:bg-gray-700 cursor-pointer text-red-400"
                                onClick={() => handleMemberAction(member.id, 'remove')}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Remove Member
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
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm || selectedFilter !== 'all' || selectedStatus !== 'all' 
                  ? 'No members match your filters' 
                  : 'No members found'
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || selectedFilter !== 'all' || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first member to get started'
                }
              </p>
              {(!searchTerm && selectedFilter === 'all' && selectedStatus === 'all') && (
                <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}