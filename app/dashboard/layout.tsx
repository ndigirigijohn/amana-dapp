"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { Menu, Home, Users, FileText, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Transactions", href: "/dashboard/transactions", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <ProtectedRoute>
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
              <Image src="/logo.png" width={32} height={32} alt="Amana CE Logo" />
              <span className="font-bold">Amana CE</span>
            </Link>
          </header>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col gap-2 p-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" width={32} height={32} alt="Amana CE Logo" />
                <span className="font-bold">Amana CE</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {user?.role === "admin" ? "Administrator" : "Member"} Dashboard
              </p>
            </div>
            <nav className="grid gap-2 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
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
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted justify-start font-normal"
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation */}
        <div className="hidden border-r bg-muted/40 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col gap-2 p-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" width={32} height={32} alt="Amana CE Logo" />
              <span className="font-bold">Amana CE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {user?.role === "admin" ? "Administrator" : "Member"} Dashboard
            </p>
          </div>
          <nav className="grid gap-2 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
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
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted justify-start font-normal"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background px-6 lg:flex">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{user?.role === "admin" ? "Administrator" : "Member"} Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
