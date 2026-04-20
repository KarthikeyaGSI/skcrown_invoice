'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { InvoiceData } from '@/types';

interface Props {
  data: InvoiceData;
  id?: string;
}

export default function InvoicePreview({ data, id = "preview-content" }: Props) {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div 
      id={id}
      className="w-full bg-white shadow-2xl rounded-sm p-12 min-h-[842px] border border-black/5 flex flex-col text-charcoal print:shadow-none print:border-none"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center shadow-gold">
            <Crown className="text-charcoal" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">SK CROWN</h1>
            <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] font-bold mt-1">Conventions · Warangal</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-black/10 uppercase tracking-tighter leading-none">INVOICE</h2>
          <p className="text-sm font-bold text-gold mt-2">#{data.invoiceNumber || 'INV-XXXX'}</p>
        </div>
      </div>

      <div className="h-[1px] w-full bg-black/5 mb-12" />

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-3">Bill To</p>
          <h3 className="text-lg font-bold text-charcoal">{data.clientName || 'Client Name'}</h3>
          <p className="text-sm text-black/50 leading-relaxed max-w-[240px]">
            {data.clientAddress || 'Client Address'}
          </p>
          <p className="text-sm text-black/50 mt-1">{data.clientEmail || 'client@email.com'}</p>
        </div>
        <div className="text-right">
          <div className="inline-block text-left">
            <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-3">Invoice Details</p>
            <div className="space-y-1">
              <div className="flex justify-between gap-8">
                <span className="text-xs font-bold text-black/40">Issued:</span>
                <span className="text-xs font-bold text-charcoal">{data.date ? formatDate(new Date(data.date)) : '---'}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-xs font-bold text-black/40">Due Date:</span>
                <span className="text-xs font-bold text-charcoal">{data.dueDate ? formatDate(new Date(data.dueDate)) : '---'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gold/20">
              <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Description</th>
              <th className="text-center py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Qty</th>
              <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Rate</th>
              <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.items.length > 0 ? data.items.map((item, index) => (
              <tr key={item.id}>
                <td className="py-6 text-sm font-bold text-charcoal">{item.description}</td>
                <td className="py-6 text-sm font-bold text-black/60 text-center">{item.quantity}</td>
                <td className="py-6 text-sm font-bold text-black/60 text-right">{formatCurrency(item.rate)}</td>
                <td className="py-6 text-sm font-black text-charcoal text-right">{formatCurrency(item.amount)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm italic text-black/20">No items added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Totals */}
      <div className="mt-12 flex justify-between items-start">
        <div className="flex-1 max-w-[200px]">
          <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">Authorized Signature</p>
          <div className="h-16 border-b border-black/10 flex items-end justify-center pb-2 italic text-sm text-black/40">
            Sign digitally online
          </div>
        </div>
        <div className="w-64 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-black/40">Subtotal</span>
            <span className="font-bold text-charcoal dark:text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-black/40">CGST (2.5%)</span>
            <span className="font-medium text-charcoal dark:text-white">{formatCurrency(subtotal * 0.025)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-black/40">SGST (2.5%)</span>
            <span className="font-medium text-charcoal dark:text-white">{formatCurrency(subtotal * 0.025)}</span>
          </div>
          <div className="h-[1px] bg-black/10 my-2" />
          <div className="flex justify-between items-center bg-gold/10 p-3 rounded-lg border border-gold/20">
            <span className="text-sm font-black uppercase tracking-widest text-gold-hover">Grand Total</span>
            <span className="text-xl font-black text-charcoal dark:text-white">{formatCurrency(subtotal * 1.05)}</span>
          </div>
        </div>
      </div>


      <div className="mt-20 pt-8 border-t border-black/5">
        <div className="flex justify-between items-center">
          <div className="text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">
            Thank you for choosing SK Crown Conventions
          </div>
          <div className="text-[10px] text-black/30 font-bold uppercase tracking-[0.1em]">
            skcrownconventions.com
          </div>
        </div>
      </div>
    </div>
  );
}
