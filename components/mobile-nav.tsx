"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            href="#features"
            className="text-lg font-medium transition-colors hover:text-primary px-3 py-2"
            onClick={handleLinkClick}
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="text-lg font-medium transition-colors hover:text-primary px-3 py-2"
            onClick={handleLinkClick}
          >
            Benefits
          </Link>
          <Link
            href="#how-it-works"
            className="text-lg font-medium transition-colors hover:text-primary px-3 py-2"
            onClick={handleLinkClick}
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-lg font-medium transition-colors hover:text-primary px-3 py-2"
            onClick={handleLinkClick}
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="text-lg font-medium transition-colors hover:text-primary px-3 py-2"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="outline" asChild>
              <Link href="/auth/signin" onClick={handleLinkClick}>
                Sign In
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/auth/signup" onClick={handleLinkClick}>
                Sign Up
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
