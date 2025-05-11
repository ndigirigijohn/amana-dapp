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
      { name: "Voting", href: "/dashboard/governance/voting" },
      { name: "History", href: "/dashboard/governance/history" }
    ] 
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [entityName, setEntityName] = useState<string>("")
  
  // Find active main navigation item based on pathname
  const activeMainNav = mainNavigation.find(item => 
    pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  // Only render on client-side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    // Check if wallet is connected and entity exists
    const walletConnection = getSavedWalletConnection();
    const entityData = localStorage.getItem('amana_current_entity');
    
    if (!walletConnection || !entityData) {
      router.push('/entity-registry');
      return;
    }
    
    try {
      const entity = JSON.parse(entityData);
      setEntityName(entity.name || "My SACCO Entity");
    } catch (error) {
      console.error("Error parsing entity data:", error);
    }
  }, [router]);

  if (!isClient) {
    return null; // Return null on server to avoid hydration issues
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:hidden">
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Amana_logo.png" width={32} height={32} alt="Amana CE Logo" />
            <span className="font-bold">Amana CE</span>
          </Link>
          <div className="flex-1 flex justify-end">
            <WalletConnect />
          </div>
        </header>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col gap-2 p-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Amana_logo.png" width={32} height={32} alt="Amana CE Logo" />
              <span className="font-bold">Amana CE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {entityName}
            </p>
          </div>
          <nav className="grid gap-2 px-2 py-4">
            {mainNavigation.map((item) => {
              const isActive = item === activeMainNav;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation - Left Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col gap-2 p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Amana_logo.png" width={32} height={32} alt="Amana CE Logo" />
            <span className="font-bold">Amana CE</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {entityName}
          </p>
        </div>
        <nav className="grid gap-2 px-2 py-4">
          {mainNavigation.map((item) => {
            const isActive = item === activeMainNav;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Top bar with sub-navigation */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background">
          <div className="flex h-full items-center px-4 md:px-6">
            {/* Main section title */}
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">{activeMainNav?.name || "Dashboard"}</h1>
              {pathname !== "/dashboard" && (
                <p className="text-sm text-muted-foreground">
                  {activeMainNav?.subItems.find(sub => sub.href === pathname)?.name || "Overview"}
                </p>
              )}
            </div>
            
            {/* Sub-navigation for selected main item */}
            {/* Fixed the error by adding a conditional check for activeMainNav and its subItems */}
            {activeMainNav && activeMainNav.subItems && activeMainNav.subItems.length > 0 && (
              <nav className="ml-8 hidden md:flex items-center space-x-4">
                {activeMainNav.subItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        isActive 
                          ? "bg-muted font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
  )
}