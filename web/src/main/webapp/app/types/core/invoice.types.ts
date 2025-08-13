export interface Invoice {
  id: string;
  invoiceNumber: string;
  loadId: string;
  companyId: string;
  invoiceType: string;
  status: InvoiceStatus;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PARTIAL_PAID = 'PARTIAL_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  loadId: string;
  companyId: string;
  invoiceType: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  notes?: string;
}

export interface UpdateInvoiceRequest extends CreateInvoiceRequest {
  status?: InvoiceStatus;
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface InvoiceFilter {
  status?: InvoiceStatus;
  invoiceType?: string;
  companyId?: string;
  loadId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface InvoiceSummary {
  totalOutstanding: number;
  paidThisMonth: number;
  overdueAmount: number;
  averagePaymentTime: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
}