"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Shield, Users, Building, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import MemberModal, { type MemberData } from "@/components/member-modal"

export default function EntityRegistryPage() {
  const [activeTab, setActiveTab] = useState("setup")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const [entityData, setEntityData] = useState({
    name: "",
    description: "",
    governanceModel: "democratic",
    membershipFee: "1000",
    enableKYC: true,
    treasuryMultisig: true,
    treasurySignatures: "3",
    votingThreshold: "51",
  })

  const [members, setMembers] = useState<MemberData[]>([])
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [editingMember, setEditingMember] = useState<MemberData | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEntityData({ ...entityData, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEntityData({ ...entityData, [name]: checked })
  }

  const handleAddMember = (member: MemberData) => {
    setMembers([...members, member])
  }

  const handleEditMember = (member: MemberData) => {
    setMembers(members.map((m) => (m.id === member.id ? member : m)))
    setEditingMember(null)
  }

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  const handleCreateEntity = async () => {
    setIsSubmitting(true)
    try {
      // This would be a call to your blockchain service in a real app
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Chain Entity created successfully",
        description: "Your SACCO has been registered on the blockchain.",
      })

      // Move to next step
      setActiveTab("treasury")
    } catch (error) {
      toast({
        title: "Error creating Chain Entity",
        description: "There was an issue registering your SACCO. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInitializeTreasury = async () => {
    setIsSubmitting(true)
    try {
      // This would be a call to your blockchain service in a real app
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Treasury initialized successfully",
        description: "Your SACCO treasury has been set up on the blockchain.",
      })

      // Move to next step
      setActiveTab("members")
    } catch (error) {
      toast({
        title: "Error initializing treasury",
        description: "There was an issue setting up your treasury. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterMembers = async () => {
    setIsSubmitting(true)
    try {
      // This would be a call to your blockchain service in a real app
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Initial members registered successfully",
        description: "Your SACCO is now ready to operate on the blockchain.",
      })

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Error registering members",
        description: "There was an issue registering members. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Create Your Chain Entity</h1>
          <p className="text-muted-foreground mt-2">
            Follow the steps below to register your SACCO on the blockchain and set up your digital operations.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="setup">Entity Setup</TabsTrigger>
            <TabsTrigger value="treasury" disabled={activeTab === "setup"}>
              Treasury Setup
            </TabsTrigger>
            <TabsTrigger value="members" disabled={activeTab === "setup" || activeTab === "treasury"}>
              Member Registration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set up your SACCO's identity on the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">SACCO Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={entityData.name}
                      onChange={handleChange}
                      placeholder="e.g., Community Savings Cooperative"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={entityData.description}
                      onChange={handleChange}
                      placeholder="Describe the purpose and goals of your SACCO..."
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardHeader className="pb-4 pt-0">
                <CardTitle>Governance Settings</CardTitle>
                <CardDescription>Configure how your SACCO will operate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="governanceModel">Governance Model</Label>
                    <select
                      id="governanceModel"
                      name="governanceModel"
                      value={entityData.governanceModel}
                      onChange={(e) => setEntityData({ ...entityData, governanceModel: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="democratic">Democratic (One Member, One Vote)</option>
                      <option value="representative">Representative (Elected Board)</option>
                      <option value="weighted">Weighted (Based on Contribution)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="membershipFee">Membership Fee (KES)</Label>
                    <Input
                      id="membershipFee"
                      name="membershipFee"
                      type="number"
                      value={entityData.membershipFee}
                      onChange={handleChange}
                      placeholder="1000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="votingThreshold">Voting Threshold (%)</Label>
                    <Input
                      id="votingThreshold"
                      name="votingThreshold"
                      type="number"
                      min="1"
                      max="100"
                      value={entityData.votingThreshold}
                      onChange={handleChange}
                      placeholder="51"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="enableKYC">Enable KYC Requirements</Label>
                      <Switch
                        id="enableKYC"
                        checked={entityData.enableKYC}
                        onCheckedChange={(checked) => handleSwitchChange("enableKYC", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Require identity verification for new members</p>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Blockchain Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This will create a smart contract on the Cardano blockchain to manage your SACCO. All settings
                          can be updated later through governance proposals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
                <Button onClick={handleCreateEntity} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Entity..." : "Create Entity"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Treasury Configuration</CardTitle>
                <CardDescription>Set up your SACCO's financial operations on the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="treasuryMultisig">Enable Multi-signature Approvals</Label>
                      <Switch
                        id="treasuryMultisig"
                        checked={entityData.treasuryMultisig}
                        onCheckedChange={(checked) => handleSwitchChange("treasuryMultisig", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Require multiple approvals for financial transactions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treasurySignatures">Required Signatures</Label>
                    <Input
                      id="treasurySignatures"
                      name="treasurySignatures"
                      type="number"
                      value={entityData.treasurySignatures}
                      onChange={handleChange}
                      placeholder="3"
                      disabled={!entityData.treasuryMultisig}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Initial Services to Enable</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Savings Accounts", icon: Shield, enabled: true },
                        { name: "Loans", icon: Users, enabled: true },
                        { name: "Dividends Distribution", icon: Building, enabled: true },
                        { name: "Investment Pools", icon: Settings, enabled: false },
                      ].map((service) => (
                        <div key={service.name} className="flex items-center space-x-4 rounded-lg border p-4">
                          <div className={`rounded-full p-2 ${service.enabled ? "bg-primary/10" : "bg-muted"}`}>
                            <service.icon
                              className={`h-5 w-5 ${service.enabled ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                          </div>
                          <Switch checked={service.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Treasury Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This will initialize a treasury smart contract on the blockchain. All financial transactions
                          will be recorded immutably, providing complete transparency and audit trails.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("setup")}>
                  Back
                </Button>
                <Button onClick={handleInitializeTreasury} disabled={isSubmitting}>
                  {isSubmitting ? "Initializing Treasury..." : "Initialize Treasury"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Initial Member Registration</CardTitle>
                <CardDescription>Add founding members to your SACCO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Add Initial Members</h3>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingMember(true)}>
                      + Add Member
                    </Button>
                  </div>

                  <div className="border rounded-md divide-y">
                    {/* Add current user as default admin */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user?.name || "Current User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Administrator</span>
                      </div>
                    </div>

                    {/* Display added members */}
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground capitalize">{member.role}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingMember(member)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id!)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {members.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No additional members added yet. Click "Add Member" to add more members to your SACCO.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Membership Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          These members will be registered on the blockchain and will have access to the governance
                          functions of your SACCO. Additional members can be added later.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("treasury")}>
                  Back
                </Button>
                <Button onClick={handleRegisterMembers} disabled={isSubmitting}>
                  {isSubmitting ? "Registering Members..." : "Complete Setup"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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
