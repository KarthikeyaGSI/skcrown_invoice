'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import SignatureCapture from '../invoices/SignatureCapture';
import { saveLeadSignature } from '@/app/crm/actions';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  clientName: string;
}

export default function SignatureModal({ isOpen, onClose, leadId, clientName }: Props) {
  const handleSave = async (signature: string) => {
    try {
      const res = await saveLeadSignature(leadId, signature);
      if (res.success) {
        toast.success(`Signature captured for ${clientName}`);
        onClose();
      } else {
        toast.error("Failed to save signature");
      }
    } catch (error) {
      toast.error("An error occurred");
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-charcoal p-8 rounded-3xl shadow-2xl z-[201]"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-charcoal dark:text-white">Collect Approval</h3>
                <p className="text-xs font-bold text-gold uppercase tracking-widest mt-1">{clientName}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-2xl border border-black/5 dark:border-white/5 mb-6">
              <SignatureCapture 
                onSave={handleSave}
                onClear={() => {}}
              />
            </div>

            <div className="flex items-center gap-3 text-black/40 dark:text-white/40 mb-2">
              <CheckCircle2 size={16} className="text-gold" />
              <p className="text-[10px] font-bold uppercase tracking-wide">Signature is legally binding for SK Crown</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
