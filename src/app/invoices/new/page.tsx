'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Save, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

import Link from 'next/link';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import InvoicePreview from '@/components/invoices/InvoicePreview';
import { InvoiceData } from '@/types';

export default function NewInvoicePage() {
  const [data, setData] = useState<InvoiceData>({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [],
    notes: '',
    taxRate: 5,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('preview-content');
      
      const opt = {
        margin: 0,
        filename: `Invoice_${data.invoiceNumber || 'New'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };


      if (element) {
        await html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Link 
            href="/invoices" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/20 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Invoices
          </Link>
          <h1 className="text-3xl font-black text-charcoal tracking-tight">Create Invoice</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl border border-black/10 font-bold text-sm hover:bg-black/5 transition-all flex items-center gap-2">
            <Save size={18} /> Save as Draft
          </button>
          <button 
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-6 py-3 rounded-xl bg-gold text-charcoal font-black text-sm shadow-gold hover:bg-gold-hover hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        {/* Left: Form */}
        <div className="max-w-2xl w-full">
          <InvoiceForm data={data} onChange={setData} />
        </div>

        {/* Right: Live Preview */}
        <div className="xl:sticky xl:top-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Live Premium Preview</span>
          </div>
          <div className="scale-[0.85] origin-top-left -mr-[15%]">
            <InvoicePreview data={data} id="preview-content" />
          </div>
        </div>
      </div>
    </div>
  );
}
