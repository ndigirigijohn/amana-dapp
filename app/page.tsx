'use client'

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, ExternalLink, Coins, TrendingUp, Lock, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '$65B+', label: 'Cooperative Market' },
    { value: '15,000+', label: 'Cooperatives in Africa' },
    { value: '50M+', label: 'Potential Users' },
    { value: '40%', label: 'Cost Reduction' }
  ];

  const features = [
    {
      icon: Lock,
      title: 'Multi-Sig Treasury',
      description: 'Secure fund management with cryptographic verification and automated compliance'
    },
    {
      icon: Coins,
      title: 'Native Tokenization',
      description: 'Member NFTs, governance tokens, and yield-bearing assets on Cardano'
    },
    {
      icon: TrendingUp,
      title: 'DeFi Integration',
      description: 'Access decentralized finance protocols for enhanced treasury management'
    }
  ];

  const processSteps = [
    { step: '01', title: 'Create Your Cooperative', desc: 'Instant cooperative setup on Cardano blockchain' },
    { step: '02', title: 'Onboard Members', desc: 'NFT-based identity and governance participation' },
    { step: '03', title: 'Automate Operations', desc: 'Transparent treasury and voting mechanisms' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
              <span className="text-2xl font-bold tracking-tight">Amana CE</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Platform</a>
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Features</a>
              <a href="#process" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Process</a>
              <Link href="/entity-registry">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium">
                  Launch dApp
                </button>
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            <a href="#" onClick={() => setIsMenuOpen(false)}>Platform</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#process" onClick={() => setIsMenuOpen(false)}>Process</a>
            <Link href="/entity-registry">
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 rounded-xl">
                Launch dApp
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[600px] h-[600px] border border-white/5 rounded-full"></div>
            <div className="absolute inset-8 border border-white/10 rounded-full"></div>
            <div className="absolute inset-16 border border-emerald-500/20 rounded-full"></div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-3 bg-emerald-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-300 font-medium">Powered by Cardano</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight tracking-tight">
            <span className="block text-white">DeFi for</span>
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Cooperatives
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transforming African financial cooperatives with fast, cost-saving, transparent, tokenized and borderless transactions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
            <Link href="/entity-registry">
              <button className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
                <span>Get Started</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="border border-white/20 hover:bg-white/5 hover:border-emerald-500/50 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center space-x-3">
              <span>View Demo</span>
              <ExternalLink size={20} />
            </button>
          </div>

          {/* Stats Grid - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Blockchain-Native
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built specifically for cooperative finance with Cardano's sustainable, 
              scalable blockchain technology.
            </p>
          </div>

          {/* Features - Single Column */}
          <div className="max-w-5xl mx-auto space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 text-left">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-32 px-6 bg-gradient-to-b from-transparent to-emerald-900/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Three Steps
              </span>
              <br />
              to Transform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Deploy your cooperative on blockchain in minutes, not months.
            </p>
          </div>

          {/* Process Steps - Single Column */}
          <div className="max-w-2xl mx-auto space-y-12">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-8">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Join the Future of
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Cooperative Finance
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Experience unprecedented transparency, efficiency, and global reach 
            for your financial cooperative.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/entity-registry">
              <button className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
                <span>Get Started</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="border border-white/20 hover:bg-white/5 hover:border-emerald-500/50 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300">
              Book Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl rotate-45 transform"></div>
                <span className="text-2xl font-bold tracking-tight">Amana CE</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Empowering African cooperatives through blockchain innovation, 
                built on Cardano for sustainability and global reach.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-emerald-400">Platform</h4>
              <div className="space-y-3 text-gray-400">
                <div className="hover:text-white cursor-pointer transition-colors">Features</div>
                <div className="hover:text-white cursor-pointer transition-colors">Documentation</div>
                <div className="hover:text-white cursor-pointer transition-colors">API Reference</div>
                <div className="hover:text-white cursor-pointer transition-colors">Smart Contracts</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-emerald-400">Resources</h4>
              <div className="space-y-3 text-gray-400">
                <div className="hover:text-white cursor-pointer transition-colors">Whitepaper</div>
                <div className="hover:text-white cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-white cursor-pointer transition-colors">Community</div>
                <div className="hover:text-white cursor-pointer transition-colors">Support</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Amana Chain Entities. Built on Cardano.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">Twitter</div>
              <div className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">Discord</div>
              <div className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">GitHub</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}