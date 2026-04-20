'use client';

import React from 'react';
import { Plus, Trash2, Calendar, User, Mail, MapPin, Hash } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '@/types';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: Props) {
  const updateField = (field: keyof InvoiceData, value: string | number | InvoiceItem[]) => {
    onChange({ ...data, [field]: value });
  };


  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = data.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = (Number(updatedItem.quantity) || 0) * (Number(updatedItem.rate) || 0);
        }
        return updatedItem;
      }
      return item;
    });
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Section 1: Basic Info */}
      <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-premium space-y-6">
        <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
          <Hash className="text-gold" size={18} />
          Document Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Invoice Number</label>
            <input 
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              placeholder="INV-001"
              className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all placeholder:text-black/10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Issue Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
              <input 
                type="date"
                value={data.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Client Info */}
      <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-premium space-y-6">
        <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
          <User className="text-gold" size={18} />
          Client Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Client Name</label>
              <input 
                type="text"
                value={data.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder="Enter client's full name"
                className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 px-4 text-sm font-bold outline-none transition-all placeholder:text-black/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                <input 
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="client@mail.com"
                  className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all placeholder:text-black/10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                <input 
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Billing Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-black/20" size={16} />
              <textarea 
                rows={3}
                value={data.clientAddress}
                onChange={(e) => updateField('clientAddress', e.target.value)}
                placeholder="Street address, City, Pincode"
                className="w-full bg-black/5 border border-transparent focus:border-gold/30 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all placeholder:text-black/10 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Line Items */}
      <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-premium space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <Plus className="text-gold" size={18} />
            Line Items
          </h3>
          <button 
            onClick={addItem}
            className="text-xs font-black uppercase tracking-widest text-gold hover:text-gold-hover transition-colors flex items-center gap-2"
          >
            Add New Item <Plus size={14} />
          </button>
        </div>
        
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 rounded-xl bg-black/5 border border-transparent hover:border-gold/20 transition-all group">
              <div className="col-span-6 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Description</label>
                <input 
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Venue Rent, Catering, etc."
                  className="w-full bg-white/50 border border-transparent focus:border-gold/30 focus:bg-white rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Qty</label>
                <input 
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  className="w-full bg-white/50 border border-transparent focus:border-gold/30 focus:bg-white rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all"
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Rate</label>
                <input 
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                  className="w-full bg-white/50 border border-transparent focus:border-gold/30 focus:bg-white rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all"
                />
              </div>
              <div className="col-span-1 py-2 flex justify-center">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-black/10 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
