'use client';

import React from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { MoreVertical, ExternalLink } from 'lucide-react';

interface ActivityItem {
  id: string;
  customer: string;
  date: Date;
  amount: number;
  status: 'Published' | 'Draft' | 'Sent';
  type: 'Invoice' | 'Quotation';
}

interface ActivityTableProps {
  items: ActivityItem[];
  title: string;
}

export default function ActivityTable({ items, title }: ActivityTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-premium overflow-hidden">
      <div className="px-6 py-5 border-b border-black/5 flex justify-between items-center text-charcoal">
        <h3 className="font-bold text-lg">{title}</h3>
        <button className="text-sm font-bold text-gold hover:text-gold-hover transition-colors flex items-center gap-2">
          View All <ExternalLink size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 text-[10px] uppercase tracking-widest font-bold text-black/40">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-black/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter",
                    item.status === 'Published' ? "bg-green-100 text-green-700" :
                    item.status === 'Draft' ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{item.customer}</p>
                    <p className="text-[10px] text-black/40">{item.type} #{item.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-black/60 font-medium">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-charcoal text-right">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-black/5 text-black/20 hover:text-gold transition-all">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
