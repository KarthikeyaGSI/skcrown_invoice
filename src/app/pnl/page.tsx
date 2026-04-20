'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { getPnLData, getFinancialSummary } from '@/lib/actions/financial-actions';

export default function PnLPage() {
  const [pnlData, setPnlData] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const [data, summ] = await Promise.all([
        getPnLData(),
        getFinancialSummary()
      ]);
      setPnlData(data);
      setSummary(summ);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-gold font-black tracking-widest text-xs animate-pulse">GENERATING FINANCIAL STATEMENTS</p>
    </div>
  );

  const totalRevenue = summary?.totalRevenue || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const totalProfit = summary?.netProfit || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-charcoal tracking-tight">P&L Tracker</h1>
          <p className="text-black/40 font-medium">Detailed financial breakdown for the current fiscal year.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl border border-black/10 font-bold text-sm hover:bg-black/5 transition-all flex items-center gap-2">
            <Filter size={18} /> FY 2024-25
          </button>
          <button className="px-6 py-3 rounded-xl bg-gold text-charcoal font-black text-sm shadow-gold hover:bg-gold-hover hover:-translate-y-1 transition-all flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-premium">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Total Revenue</p>
          <h2 className="text-2xl font-black text-charcoal mt-1">{formatCurrency(totalRevenue)}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-premium">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Total Expenses</p>
          <h2 className="text-2xl font-black text-charcoal mt-1">{formatCurrency(totalExpenses)}</h2>
        </div>
        <div className="bg-gold p-6 rounded-2xl shadow-gold col-span-1 md:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Net Operating Profit</p>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black text-charcoal mt-1">{formatCurrency(totalProfit)}</h2>
            <div className="bg-charcoal/10 px-3 py-1 rounded-full text-xs font-black text-charcoal flex items-center gap-1">
              <ArrowUpRight size={14} /> +{summary?.profitTrend}%
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-premium overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5">
          <h3 className="font-bold text-lg text-charcoal">Monthly Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 text-[10px] uppercase tracking-widest font-black text-black/40">
                <th className="px-8 py-5">Month</th>
                <th className="px-8 py-5 text-right">Revenue</th>
                <th className="px-8 py-5 text-right">Expenses</th>
                <th className="px-8 py-5 text-right">Net Profit</th>
                <th className="px-8 py-5 text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {pnlData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-black/20 font-bold italic">No financial data found for the current period.</td>
                </tr>
              ) : pnlData.map((data, index) => {
                const margin = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : "0.0";
                return (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={data.month} 
                    className="hover:bg-black/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                          <Calendar size={14} className="text-gold" />
                        </div>
                        <span className="font-bold text-charcoal">{data.month}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-charcoal/70">
                      {formatCurrency(data.revenue)}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-charcoal/70">
                      {formatCurrency(data.expenses)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn(
                        "font-black",
                        data.profit >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {formatCurrency(data.profit)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-black text-black/40">{margin}%</span>
                        <div className="w-16 h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold" 
                            style={{ width: `${Math.max(0, parseFloat(margin))}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            {pnlData.length > 0 && (
              <tfoot>
                <tr className="bg-charcoal text-white font-black">
                  <td className="px-8 py-6">AGGREGATE TOTAL</td>
                  <td className="px-8 py-6 text-right">{formatCurrency(totalRevenue)}</td>
                  <td className="px-8 py-6 text-right">{formatCurrency(totalExpenses)}</td>
                  <td className="px-8 py-6 text-right text-gold">{formatCurrency(totalProfit)}</td>
                  <td className="px-8 py-6 text-right">
                    {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-premium">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="text-green-600" />
            </div>
            <div>
              <h4 className="font-black text-charcoal">Profitability Insight</h4>
              <p className="text-xs text-black/40 font-bold uppercase tracking-widest mt-0.5">Automated Analysis</p>
            </div>
          </div>
          <p className="text-sm text-black/60 leading-relaxed">
            Your net profit margin is currently <span className="font-bold text-charcoal">{totalRevenue > 0 ? ((totalProfit/totalRevenue)*100).toFixed(1) : 0}%</span>. 
            Keep monitoring event-specific margins to optimize venue ROI during peak seasons.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-premium">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
              <ArrowDownRight className="text-gold" />
            </div>
            <div>
              <h4 className="font-black text-charcoal">Expense Alert</h4>
              <p className="text-xs text-black/40 font-bold uppercase tracking-widest mt-0.5">Automated Analysis</p>
            </div>
          </div>
          <p className="text-sm text-black/60 leading-relaxed">
            Dynamic expense monitoring is active. Total operational costs for FY 24-25 currently stand at <span className="font-bold text-charcoal">{formatCurrency(totalExpenses)}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
