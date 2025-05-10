"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog"
import { Input } from "@/components/common/input"
import { Label } from "@/components/common/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import { Switch } from "@/components/common/switch"
import { useToast } from "@/hooks/use-toast"

export type MemberRole = "member" | "admin" | "treasurer" | "secretary" | "chairperson"

export interface MemberData {
  id?: string
  name: string
  email: string
  phone: string
  role: MemberRole
  walletAddress: string
  shares: string
  kycVerified: boolean
}

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: MemberData) => void
  initialData?: Partial<MemberData>
  isEditing?: boolean
}

export default function MemberModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  isEditing = false,
}: MemberModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [memberData, setMemberData] = useState<MemberData>({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    role: initialData.role || "member",
    walletAddress: initialData.walletAddress || "",
    shares: initialData.shares || "1",
    kycVerified: initialData.kycVerified || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMemberData({ ...memberData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!memberData.name || !memberData.email) {
        throw new Error("Name and email are required")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(memberData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave({
        ...memberData,
        id: initialData.id || `member-${Date.now()}`,
      })

      toast({
        title: isEditing ? "Member updated" : "Member added",
        description: isEditing
          ? `${memberData.name} has been updated successfully`
          : `${memberData.name} has been added to your SACCO`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Member" : "Add New Member"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update member information in your SACCO"
                : "Add a new member to your SACCO. They will receive an invitation email."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={memberData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={memberData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={memberData.phone}
                  onChange={handleChange}
                  placeholder="+254 123 456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={memberData.role}
                  onValueChange={(value: MemberRole) => setMemberData({ ...memberData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="treasurer">Treasurer</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                    <SelectItem value="chairperson">Chairperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Blockchain Wallet Address (Optional)</Label>
              <Input
                id="walletAddress"
                name="walletAddress"
                value={memberData.walletAddress}
                onChange={handleChange}
                placeholder="addr1..."
              />
              <p className="text-xs text-muted-foreground">
                The member can add this later if they don't have a Cardano wallet yet
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shares">Initial Shares</Label>
                <Input
                  id="shares"
                  name="shares"
                  type="number"
                  min="1"
                  value={memberData.shares}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="kycVerified">KYC Verified</Label>
                  <Switch
                    id="kycVerified"
                    checked={memberData.kycVerified}
                    onCheckedChange={(checked) => setMemberData({ ...memberData, kycVerified: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
