'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  LucideIcon 
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  icon: LucideIcon;
  variant?: 'gold' | 'charcoal' | 'default';
}

export default function StatCard({ title, value, trend, icon: Icon, variant = 'default' }: StatCardProps) {
  const isPositive = trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group shadow-premium",
        variant === 'gold' 
          ? "bg-gold border-gold text-charcoal shadow-gold" 
          : variant === 'charcoal'
          ? "bg-charcoal border-white/10 text-white-accent"
          : "bg-white border-black/5 hover:border-gold/20"
      )}
    >
      {/* Background Micro-animation */}
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'gold' ? "bg-charcoal/10" : "bg-gold/10"
        )}>
          <Icon className={cn(
            variant === 'gold' ? "text-charcoal" : "text-gold"
          )} size={24} />
        </div>
        
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
          variant === 'gold' 
            ? "bg-charcoal/10 text-charcoal" 
            : isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <p className={cn(
          "text-xs uppercase tracking-widest font-bold",
          variant === 'gold' ? "text-charcoal/60" : "text-black/40"
        )}>
          {title}
        </p>
        <h3 className="text-3xl font-black mt-1">
          {formatCurrency(value)}
        </h3>
      </div>
    </motion.div>
  );
}
