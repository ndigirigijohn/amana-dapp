'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Home, 
  Search,
  Code
} from 'lucide-react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full">
                <Search className="h-12 w-12 text-emerald-400" />
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl font-bold text-white mb-3">
              Page Not Found
            </h1>
            
            {/* Description */}
            <div className="space-y-3 mb-8 text-gray-300">
              <p className="text-lg">
                This page was not found.
              </p>
              <p className="text-sm">
                If it's a feature you were looking for, it's likely under development as the project is actively being built.
              </p>
            </div>

            {/* Development indicator */}
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Code className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Active Development</span>
              </div>
              <p className="text-xs text-gray-400">
                New features are being added regularly
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                asChild
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 rounded-xl"
              >
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button 
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}