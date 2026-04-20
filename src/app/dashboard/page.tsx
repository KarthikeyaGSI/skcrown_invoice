'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityTable from '@/components/dashboard/ActivityTable';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Jan', revenue: 450000, expenses: 320000 },
  { name: 'Feb', revenue: 520000, expenses: 340000 },
  { name: 'Mar', revenue: 480000, expenses: 310000 },
  { name: 'Apr', revenue: 610000, expenses: 380000 },
  { name: 'May', revenue: 590000, expenses: 390000 },
  { name: 'Jun', revenue: 720000, expenses: 420000 },
];

const mockActivities: any[] = [
  { id: 'INV-001', customer: 'Suresh Kumar Wedding', date: new Date(), amount: 250000, status: 'Published', type: 'Invoice' },
  { id: 'QUO-042', customer: 'Corporate Tech Meetup', date: new Date(), amount: 125000, status: 'Sent', type: 'Quotation' },
  { id: 'INV-002', customer: 'Dr. Reddy Reception', date: new Date(), amount: 350000, status: 'Draft', type: 'Invoice' },
  { id: 'QUO-043', customer: 'Birthday Gala - Riya', date: new Date(), amount: 75000, status: 'Sent', type: 'Quotation' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight">Financial Overview</h1>
          <p className="text-black/40 font-medium">Hello Admin, here's what's happening at SK Crown today.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-xl border border-black/10 font-bold text-sm hover:bg-black/5 transition-all">
            Filter Period
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-gold text-charcoal font-bold text-sm shadow-gold hover:bg-gold-hover hover:-translate-y-1 transition-all">
            Download Report
          </button>
        </div>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={3370000} 
          trend={12.5} 
          icon={TrendingUp} 
          variant="gold"
        />
        <StatCard 
          title="Total Expenses" 
          value={2160000} 
          trend={-4.2} 
          icon={Wallet} 
        />
        <StatCard 
          title="Net Profit" 
          value={1210000} 
          trend={18.1} 
          icon={Zap} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-black/5 shadow-premium p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-charcoal">Revenue vs Expenses</h3>
              <p className="text-xs text-black/40 font-bold uppercase tracking-widest mt-1">H1 2024 Performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-xs font-bold text-black/60">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-charcoal/20" />
                <span className="text-xs font-bold text-black/60">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A646" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C9A646" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 700, color: '#1A1A1A' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C9A646" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#1A1A1A20" 
                  strokeWidth={2}
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-charcoal rounded-2xl p-6 text-white overflow-hidden relative"
          >
            <div className="absolute right-0 bottom-0 text-white/5 -rotate-12 translate-x-4 translate-y-4">
              <Zap size={140} />
            </div>
            <h3 className="text-xl font-bold mb-2">Quick Creator</h3>
            <p className="text-sm text-white/50 mb-6">Generate new financial documents in seconds.</p>
            <div className="space-y-3 relative z-10">
              <button className="w-full py-4 px-4 bg-gold rounded-xl text-charcoal font-black text-sm flex items-center justify-between group hover:scale-[1.02] transition-all">
                <span>NEW INVOICE</span>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-full py-4 px-4 bg-white/10 rounded-xl text-white font-black text-sm flex items-center justify-between group hover:bg-white/20 transition-all">
                <span>NEW QUOTATION</span>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-black/5 p-6 shadow-premium"
          >
            <h4 className="text-xs uppercase tracking-[0.2em] font-black text-black/20 mb-4">Savings Target</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black text-charcoal">₹8.5L / 10L</span>
              <span className="text-sm font-bold text-gold">85%</span>
            </div>
            <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gold"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ActivityTable items={mockActivities} title="Recent Invoices & Quotes" />
      </motion.div>
    </div>
  );
}
