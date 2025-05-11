"use client"
import Link from "next/link"
import Image from "next/image";

import  WalletConnect  from "@/components/WalletConnect";


export default function NavBar() {

    return(
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Amana_logo.png?height=32&width=32"
                width={52}
                height={52}
                alt="Amana CE Logo"
              />
              <span className="inline-block text-xl font-bold">Amana CE</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="#features"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
              >
                Benefits
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
              >
                Contact
              </Link>
              <WalletConnect/>
         
            </nav>

           
          </div>
        </div>



    )


}