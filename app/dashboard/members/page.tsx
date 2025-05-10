"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/card"
import { Input } from "@/components/common/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Users, Search, UserPlus, CheckCircle, AlertCircle, Download, Upload } from "lucide-react"
import MemberModal, { type MemberData } from "@/components/member-modal"

// Mock data for demonstration
const MOCK_MEMBERS: MemberData[] = [
  {
    id: "member-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+254 712 345678",
    role: "chairperson",
    walletAddress: "addr1qxck3zj9rqpz8rq0jv9u2zj2vwr8a4qnmylzv0frncmqrh8l4zy9yaru09",
    shares: "10",
    kycVerified: true,
  },
  {
    id: "member-2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+254 723 456789",
    role: "treasurer",
    walletAddress: "addr1qy5m4g8ysyzl4gz2uw0e6lh3h7x7gkh3vmw4q2",
    shares: "8",
    kycVerified: true,
  },
  {
    id: "member-3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+254 734 567890",
    role: "secretary",
    walletAddress: "",
    shares: "5",
    kycVerified: false,
  },
  {
    id: "member-4",
    name: "Mary Williams",
    email: "mary@example.com",
    phone: "+254 745 678901",
    role: "member",
    walletAddress: "addr1qxfhgqfqe3vsj5my5l4tmnqcm9k6qgqj0xj2la",
    shares: "3",
    kycVerified: true,
  },
  {
    id: "member-5",
    name: "David Brown",
    email: "david@example.com",
    phone: "+254 756 789012",
    role: "member",
    walletAddress: "",
    shares: "2",
    kycVerified: false,
  },
]

export default function MembersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<MemberData[]>([])
  const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [editingMember, setEditingMember] = useState<MemberData | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real app, this would be an API call
    setMembers(MOCK_MEMBERS)
  }, [])

  useEffect(() => {
    let result = [...members]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.phone.toLowerCase().includes(query),
      )
    }

    // Filter by tab
    if (activeTab === "verified") {
      result = result.filter((member) => member.kycVerified)
    } else if (activeTab === "pending") {
      result = result.filter((member) => !member.kycVerified)
    }

    setFilteredMembers(result)
  }, [members, searchQuery, activeTab])

  const handleAddMember = (member: MemberData) => {
    setMembers([...members, member])
  }

  const handleEditMember = (member: MemberData) => {
    setMembers(members.map((m) => (m.id === member.id ? member : m)))
  }

  const handleRemoveMember = (id: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      setMembers(members.filter((member) => member.id !== id))
      toast({
        title: "Member removed",
        description: "The member has been removed from your SACCO",
      })
    }
  }

  const handleVerifyKYC = (id: string) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, kycVerified: true } : member)))
    toast({
      title: "KYC Verified",
      description: "The member's KYC has been verified",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage your SACCO members and their information</p>
        </div>
        <Button onClick={() => setIsAddingMember(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Members ({members.length})</TabsTrigger>
          <TabsTrigger value="verified">KYC Verified ({members.filter((m) => m.kycVerified).length})</TabsTrigger>
          <TabsTrigger value="pending">KYC Pending ({members.filter((m) => !m.kycVerified).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <MembersTable
            members={filteredMembers}
            onEdit={setEditingMember}
            onRemove={handleRemoveMember}
            onVerifyKYC={handleVerifyKYC}
          />
        </TabsContent>
        <TabsContent value="verified" className="space-y-4">
          <MembersTable
            members={filteredMembers}
            onEdit={setEditingMember}
            onRemove={handleRemoveMember}
            onVerifyKYC={handleVerifyKYC}
          />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <MembersTable
            members={filteredMembers}
            onEdit={setEditingMember}
            onRemove={handleRemoveMember}
            onVerifyKYC={handleVerifyKYC}
          />
        </TabsContent>
      </Tabs>

      {/* Member Modals */}
      <MemberModal isOpen={isAddingMember} onClose={() => setIsAddingMember(false)} onSave={handleAddMember} />

      <MemberModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleEditMember}
        initialData={editingMember || {}}
        isEditing={true}
      />
    </div>
  )
}

interface MembersTableProps {
  members: MemberData[]
  onEdit: (member: MemberData) => void
  onRemove: (id: string) => void
  onVerifyKYC: (id: string) => void
}

function MembersTable({ members, onEdit, onRemove, onVerifyKYC }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No members found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-4 font-medium">
        <div className="col-span-4">Member</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Shares</div>
        <div className="col-span-2">KYC Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="divide-y">
        {members.map((member) => (
          <div key={member.id} className="grid grid-cols-12 gap-2 p-4 items-center">
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                    {member.phone && <p className="text-xs text-muted-foreground hidden sm:block">• {member.phone}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize">
                {member.role}
              </span>
            </div>
            <div className="col-span-2">{member.shares}</div>
            <div className="col-span-2">
              {member.kycVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  <span className="text-xs">Verified</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  <span className="text-xs">Pending</span>
                </div>
              )}
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              {!member.kycVerified && (
                <Button variant="ghost" size="sm" onClick={() => onVerifyKYC(member.id!)} className="hidden sm:flex">
                  Verify
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onRemove(member.id!)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
