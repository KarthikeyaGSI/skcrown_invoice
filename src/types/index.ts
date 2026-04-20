export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
}

export type Status = 'Draft' | 'Published' | 'Sent';

export interface Lead {
  id: string;
  clientName: string;
  email?: string;
  phone?: string;
  amount?: number;
  status: 'Inquiry' | 'Site Visit' | 'Negotiation' | 'Booked' | 'Completed';
  date: string | Date;
  notes?: string;
  eventType?: string;
  guests?: number;
  signature?: string;
}

