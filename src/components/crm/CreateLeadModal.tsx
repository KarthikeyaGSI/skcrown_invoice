'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, IndianRupee, Users, Briefcase } from 'lucide-react';
import { createLead } from '@/app/crm/actions';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLeadModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    amount: '',
    eventType: '',
    guests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createLead({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        amount: parseFloat(formData.amount) || 0,
        eventType: formData.eventType,
        guests: parseInt(formData.guests) || 0
      });

      if (res.success) {
        toast.success("Lead created successfully!");
        onSuccess();
        onClose();
        setFormData({ clientName: '', email: '', phone: '', amount: '', eventType: '', guests: '' });
      } else {
        toast.error("Failed to create lead");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-charcoal shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-charcoal dark:text-white tracking-tight">Add New Lead</h2>
                  <p className="text-xs font-bold text-gold uppercase tracking-widest mt-1">Direct Pipeline Entry</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Client Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <input 
                      required
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      placeholder="e.g. Rahul Sharma Wedding"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="client@email.com"
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 00000 00000"
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Event Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <input 
                      type="text"
                      value={formData.eventType}
                      onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                      placeholder="e.g. Traditional Wedding, Corporate..."
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Proposed Budget</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input 
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="5,00,000"
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Guest Count</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input 
                        type="number"
                        value={formData.guests}
                        onChange={(e) => setFormData({...formData, guests: e.target.value})}
                        placeholder="1200"
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-gold hover:bg-gold-hover text-charcoal font-black rounded-2xl shadow-gold mt-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                >
                  {loading ? "SAVING..." : "CREATE LEAD"}
                  {!loading && <Briefcase size={20} className="group-hover:scale-110 transition-transform" />}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
