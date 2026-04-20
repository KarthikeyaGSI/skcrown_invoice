'use client';

import React, { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, User } from 'lucide-react';
import { loginAction } from '@/lib/auth-actions';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center shadow-gold"
          >
            <Crown className="text-charcoal" size={28} />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-widest leading-none">SK CROWN</h1>
            <p className="text-[9px] text-gold uppercase tracking-[0.4em] font-bold mt-2">Internal Administrator</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gold/50 rounded-full shadow-gold" />
          
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="admin@skcrown.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-gold/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-gold/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-bold text-center"
              >
                {state.error}
              </motion.div>
            )}

            <motion.button
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gold rounded-xl text-charcoal font-black text-xs uppercase tracking-widest hover:bg-gold-hover transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? 'Verifying...' : 'Access Portal'}
            </motion.button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          © 2024 SK Crown Conventions
        </p>
      </motion.div>
    </div>
  );
}
