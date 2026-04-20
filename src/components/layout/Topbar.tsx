'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Topbar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="h-20 bg-white-accent border-b border-black/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <div className="flex items-center gap-2 text-[10px] text-black/40 uppercase tracking-widest font-bold mb-1">
          <span>SK Crown</span>
          <span>/</span>
          <span className="text-gold">{getPageTitle()}</span>
        </div>
        <h2 className="text-2xl font-bold text-charcoal">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 group-hover:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-sm w-64 outline-none transition-all"
          />
        </div>

        {/* Date Display */}
        <div className="flex items-center gap-3 px-4 py-2 bg-black/5 rounded-xl border border-transparent hover:border-gold/20 transition-all cursor-default">
          <Calendar className="text-gold" size={18} />
          <span className="text-sm font-medium text-charcoal/70">{formatDate(new Date())}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-black/5 text-charcoal/60 hover:text-gold transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Icon Mobile */}
        <div className="w-10 h-10 rounded-xl bg-charcoal flex items-center justify-center md:hidden">
          <span className="text-gold font-bold text-xs">SK</span>
        </div>
      </div>
    </div>
  );
}
