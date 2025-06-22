'use client'

import { useEffect, useState } from "react";
import Link from "next/link"

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
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
          <span className="inline-block text-xl font-bold tracking-tight text-white">Amana CE</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-4">
        {/* Desktop Navigation - Minimal for landing page */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
          >
            Features
          </Link>
          <Link
            href="#process"
            className="text-sm font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
          >
            Process
          </Link>
          <Link
            href="#"
            className="text-sm font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-sm font-medium transition-colors hover:text-emerald-400 text-gray-300 px-3 py-2"
          >
            Community
          </Link>
          <Link
            href={dashboardLink}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm"
          >
            Launch dApp
          </Link>
        </nav>
      </div>
    </div>
  )
}