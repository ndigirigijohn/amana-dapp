"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900 border-gray-800">
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="#features"
            className="text-lg font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
            onClick={handleLinkClick}
          >
            Features
          </Link>
          <Link
            href="#process"
            className="text-lg font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
            onClick={handleLinkClick}
          >
            Process
          </Link>
          <Link
            href="#"
            className="text-lg font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
            onClick={handleLinkClick}
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-lg font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
            onClick={handleLinkClick}
          >
            Community
          </Link>
          <Link
            href={dashboardLink}
            className="text-lg font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          
          {/* Wallet Connect Component */}
          <div className="mt-4 px-3">
            <WalletConnect />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}