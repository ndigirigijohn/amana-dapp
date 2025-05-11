'use client'

import { useEffect, useState } from "react";
import Link from "next/link"
import Image from "next/image";
import WalletConnect from "@/components/WalletConnect";

export default function NavBar() {
  const [entityExists, setEntityExists] = useState(false);
  
  // Check if an entity exists in localStorage
  useEffect(() => {
    const checkEntityExists = () => {
      try {
        const entityData = localStorage.getItem('amana_current_entity');
        setEntityExists(!!entityData);
      } catch (error) {
        console.error('Error checking entity data:', error);
        setEntityExists(false);
      }
    };
    
    // Check initially
    checkEntityExists();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      checkEntityExists();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically as fallback
    const interval = setInterval(checkEntityExists, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Dashboard link destination based on entity existence
  const dashboardLink = entityExists ? '/dashboard' : '/entity-registry';

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
          <Link
            href={dashboardLink}
            className="text-sm font-medium transition-colors hover:text-primary px-3 py-2"
          >
            Dashboard
          </Link>
          <WalletConnect/>
        </nav>
      </div>
    </div>
  )
}