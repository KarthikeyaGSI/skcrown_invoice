'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Quote, 
  BarChart3, 
  Settings,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Quotations', href: '/quotations', icon: Quote },
  { name: 'P&L Tracker', href: '/pnl', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-charcoal text-white-accent flex flex-col fixed left-0 top-0 z-50 border-r border-white/10">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-gold">
          <Crown className="text-charcoal" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">SK CROWN</h1>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Conventions</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link key={item.name} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-gold text-charcoal shadow-gold" 
                    : "hover:bg-white/5 text-white/70 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-charcoal" : "text-gold/80"
                )} />
                <span className="font-medium text-sm">{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-charcoal rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-6 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 transition-all duration-300 group">
          <Settings size={20} className="text-white/40 group-hover:rotate-45 transition-transform" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <div className="mt-6 flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-xs font-bold text-gold">SK</span>
          </div>
          <div>
            <p className="text-sm font-medium">Administrator</p>
            <p className="text-[10px] text-white/40">Warangal, IN</p>
          </div>
        </div>
      </div>
    </div>
  );
}
