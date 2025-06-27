"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Building, LayoutDashboard, Landmark, FileCheck, AlertCircle } from "lucide-react"
import WalletConnect from "@/components/WalletConnect"
import { getSavedWalletConnection } from "@/lib/common"

// Define the main navigation structure
const mainNavigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    subItems: [] 
  },
  { 
    name: "Entity", 
    href: "/dashboard/entity", 
    icon: Building,
    subItems: [
      { name: "Overview", href: "/dashboard/entity" },
      { name: "Members", href: "/dashboard/entity/members" },
      { name: "Settings", href: "/dashboard/entity/settings" }
    ]
  },
  { 
    name: "Treasury", 
    href: "/dashboard/treasury", 
    icon: Landmark,
    subItems: [
      { name: "Overview", href: "/dashboard/treasury" },
      { name: "Transactions", href: "/dashboard/treasury/transactions" },
      { name: "Proposals", href: "/dashboard/treasury/proposals" }
    ]
  },
  { 
    name: "Governance", 
    href: "/dashboard/governance", 
    icon: FileCheck,
    subItems: [
      { name: "Overview", href: "/dashboard/governance" },
      { name: "Voting", href: "/dashboard/governance/voting" }
    ]
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [entityData, setEntityData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Find the active main navigation item
  const activeMainNav = mainNavigation.find(item => {
    if (item.href === "/dashboard" && pathname === "/dashboard") return true
    if (item.href !== "/dashboard" && pathname.startsWith(item.href)) return true
    return false
  })

  // Check entity access and load data
  useEffect(() => {
    const checkEntityAccess = async () => {
      setIsLoading(true)
      
      // Check wallet connection
      const walletConnection = getSavedWalletConnection()
      if (!walletConnection) {
        router.push('/entity-registry')
        return
      }
      
      // Check entity data
      const currentEntityData = localStorage.getItem('amana_current_entity')
      if (!currentEntityData) {
        router.push('/entity-registry')
        return
      }
      
      try {
        const parsedEntityData = JSON.parse(currentEntityData)
        setEntityData(parsedEntityData)
      } catch (error) {
        console.error("Error parsing entity data:", error)
        router.push('/entity-registry')
        return
      }
      
      setIsLoading(false)
    }
    
    checkEntityAccess()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Geometric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border border-white/5 rounded-full"></div>
          <div className="absolute inset-8 border border-white/10 rounded-full"></div>
          <div className="absolute inset-16 border border-emerald-500/20 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/5 backdrop-blur-xl border-r border-white/10 px-6 pb-4">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
                <span className="text-xl font-bold tracking-tight text-white">Amana CE</span>
              </Link>
            </div>

            {/* Entity Info */}
            {entityData && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {entityData.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {entityData.governanceModel} • {entityData.votingThreshold}% threshold
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                {mainNavigation.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25" 
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet>
          <div className="lg:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="bg-gray-900/95 backdrop-blur-xl border-gray-800 text-white">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex h-16 shrink-0 items-center">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
                  <span className="text-xl font-bold tracking-tight">Amana CE</span>
                </Link>
              </div>

              {/* Entity Info */}
              {entityData && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {entityData.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {entityData.governanceModel} • {entityData.votingThreshold}% threshold
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-2">
                  {mainNavigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                            isActive 
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25" 
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-72">
          {/* Top bar with sub-navigation */}
          <header className="sticky top-0 z-30 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10">
            <div className="flex h-full items-center px-4 md:px-6">
              {/* Main section title */}
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-white">{activeMainNav?.name || "Dashboard"}</h1>
                {pathname !== "/dashboard" && (
                  <p className="text-sm text-gray-400">
                    {activeMainNav?.subItems.find(sub => sub.href === pathname)?.name || "Overview"}
                  </p>
                )}
              </div>
              
              {/* Sub-navigation for selected main item */}
              {activeMainNav && activeMainNav.subItems && activeMainNav.subItems.length > 0 && (
                <nav className="ml-8 hidden md:flex items-center space-x-4">
                  {activeMainNav.subItems.map((subItem) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`px-3 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    )
                  })}
                </nav>
              )}
              
              {/* Right side with wallet connect */}
              <div className="ml-auto">
                <WalletConnect />
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}