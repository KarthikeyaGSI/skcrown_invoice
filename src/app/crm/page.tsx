'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Users,
  Briefcase
} from 'lucide-react';
import { getLeads, updateLeadStatus } from './actions';
import { formatCurrency } from '@/lib/utils';
import { Lead } from '@/types';

const stages = ['Inquiry', 'Site Visit', 'Negotiation', 'Booked', 'Completed'] as const;

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {

    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };

    fetchLeads();
  }, []);



  async function handleDragEnd(id: string, newStatus: string) {
    // Optimistic update
    const previousLeads = [...leads];
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    const res = await updateLeadStatus(id, newStatus);
    if (!res.success) {
      setLeads(previousLeads);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">Leads & Inquiries</h1>
          <p className="text-black/40 dark:text-white/40 font-medium">Manage your event pipeline with premium Kanban precision.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/10" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 outline-none focus:border-gold/30 transition-all"
            />
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-gold text-charcoal font-black text-sm shadow-gold hover:bg-gold-hover hover:-translate-y-1 transition-all flex items-center gap-2">
            <Plus size={18} /> NEW LEAD
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
        {stages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80">
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40">{stage}</span>
                <span className="w-5 h-5 bg-gold/10 text-gold text-[10px] font-bold rounded-full flex items-center justify-center">
                  {leads.filter(l => l.status === stage).length}
                </span>
              </div>
              <button className="text-black/20 dark:text-white/10 hover:text-gold transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Leads Column */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("id");
                handleDragEnd(id, stage);
              }}
              className="space-y-4 min-h-[500px] p-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 dark:border-white/10"
            >
              <AnimatePresence>
                {leads
                  .filter((l) => l.status === stage)
                  .map((lead) => (
                    <motion.div
                      key={lead.id}
                      layoutId={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <div
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("id", lead.id)}
                        className="p-5 bg-white dark:bg-charcoal-muted rounded-xl border border-black/5 dark:border-white/5 shadow-premium cursor-grab active:cursor-grabbing hover:border-gold/30 transition-all"
                      >

                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-charcoal dark:text-white leading-tight group-hover:text-gold transition-colors">
                          {lead.clientName}
                        </h4>
                        <div className="text-[10px] font-black text-black/20 dark:text-white/20 uppercase">
                          #{lead.id.slice(-4)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/40">
                          <Briefcase size={14} />
                          <span>{lead.eventType || 'Event TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/40">
                          <Users size={14} />
                          <span>{lead.guests || '0'} guests</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-5 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                        <span className="text-sm font-black text-charcoal dark:text-white">
                          {formatCurrency(lead.amount || 0)}
                        </span>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gold/20 border-2 border-white dark:border-charcoal flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gold">SK</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>

              
              {leads.filter(l => l.status === stage).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-black/10 dark:text-white/10 border-2 border-dashed border-transparent">
                  <div className="w-12 h-12 rounded-full border-2 border-current mb-3 flex items-center justify-center opacity-30">
                    <Plus size={24} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Leads</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
