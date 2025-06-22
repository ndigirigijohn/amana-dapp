"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Home, Users, Landmark, FileCheck, Settings, ExternalLink, ChevronRight } from "lucide-react"
import WalletConnect from "@/components/WalletConnect"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [entityExists, setEntityExists] = useState(false)

  // Check if an entity exists in localStorage
  useEffect(() => {
    const checkEntityExists = () => {
      try {
        const entityData = localStorage.getItem('amana_current_entity')
        setEntityExists(!!entityData)
      } catch (error) {
        console.error('Error checking entity data:', error)
        setEntityExists(false)
      }
    }
    
    // Check initially
    checkEntityExists()
    
    // Also check whenever the component is opened
    if (open) {
      checkEntityExists()
    }
  }, [open])

  const handleLinkClick = () => {
    setOpen(false)
  }

  // Dashboard link destination based on entity existence
  const dashboardLink = entityExists ? '/dashboard' : '/entity-registry'

  // Navigation items for landing page
  const landingNavItems = [
    { href: "#features", label: "Features", icon: FileCheck },
    { href: "#process", label: "Process", icon: Settings },
    { href: "#", label: "Documentation", icon: ExternalLink },
    { href: "#", label: "Community", icon: Users },
  ]

  // Navigation items for dashboard
  const dashboardNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/entity", label: "Entity", icon: Users },
    { href: "/dashboard/treasury", label: "Treasury", icon: Landmark },
    { href: "/dashboard/governance", label: "Governance", icon: FileCheck },
  ]

  const navItems = entityExists ? dashboardNavItems : landingNavItems

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
          <Link href="/" className="flex items-center space-x-3" onClick={handleLinkClick}>
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-lg rotate-45 transform"></div>
            <span className="text-xl font-bold text-white">Amana CE</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  <item.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="font-medium flex-1">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-800"></div>

            {/* Additional Actions */}
            <div className="space-y-2">
              <Link
                href={dashboardLink}
                className="group flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all duration-200"
                onClick={handleLinkClick}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium flex-1">
                  {entityExists ? 'Go to Dashboard' : 'Launch dApp'}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {entityExists && (
                <Link
                  href="/entity-registry"
                  className="group flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="font-medium flex-1">Entity Registry</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}
            </div>
          </nav>

          {/* Wallet Connect Section */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50">
            <div className="text-sm text-gray-400 mb-3">Wallet Connection</div>
            <WalletConnect />
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/30">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                © 2024 Amana Chain Entities
              </div>
              <div className="flex justify-center space-x-4 text-xs">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}