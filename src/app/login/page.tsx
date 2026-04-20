'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, ease: "anticipate" }}
            className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shadow-gold"
          >
            <Crown className="text-charcoal" size={36} />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-widest leading-none">SK CROWN</h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold mt-2">Executive Portal</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gold rounded-full opacity-50 shadow-gold" />
          
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-white/40">Secure access to SK Crown management systems.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full py-4 px-6 bg-white rounded-xl text-charcoal font-black text-sm flex items-center justify-center gap-4 hover:bg-gold transition-all duration-500 shadow-xl group"
          >
            <div className="w-5 h-5 bg-charcoal/5 rounded flex items-center justify-center group-hover:bg-charcoal/10 transition-colors">
              <Chrome size={18} />
            </div>
            <span>Continue with Google</span>
          </motion.button>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
              Protected by Enterprise Security
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-white/20">
          © 2024 SK Crown Conventions, Warangal.
        </p>
      </motion.div>
    </div>
  );
}
