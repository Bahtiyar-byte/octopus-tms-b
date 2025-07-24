import { ApiClient } from './api';
import { PaginatedResponse } from '../types/core/common.types';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilter,
  InvoiceSummary,
  InvoiceStatus
} from '../types/core/invoice.types';

export const invoiceService = {
  async getInvoices(
    page = 0,
    size = 20,
    filter?: InvoiceFilter
  ): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await ApiClient.get<PaginatedResponse<Invoice>>(
      `/invoices?${params.toString()}`
    );
    return response;
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await ApiClient.get<Invoice>(`/invoices/${id}`);
    return response;
  },

  async createInvoice(invoice: CreateInvoiceRequest): Promise<Invoice> {
    const response = await ApiClient.post<Invoice>('/invoices', invoice);
    return response;
  },

  async updateInvoice(id: string, invoice: UpdateInvoiceRequest): Promise<Invoice> {
    const response = await ApiClient.put<Invoice>(`/invoices/${id}`, invoice);
    return response;
  },

  async deleteInvoice(id: string): Promise<void> {
    await ApiClient.delete(`/invoices/${id}`);
  },

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    return this.updateInvoice(id, { ...invoice, status });
  },

  async markInvoiceAsPaid(
    id: string,
    paymentMethod: string,
    paymentReference?: string
  ): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    return this.updateInvoice(id, {
      ...invoice,
      status: InvoiceStatus.PAID,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      paymentReference,
    });
  },

  async sendInvoice(id: string): Promise<void> {
    await ApiClient.post(`/invoice-operations/${id}/send`);
  },

  async getInvoiceSummary(filter?: InvoiceFilter): Promise<InvoiceSummary> {
    const invoices = await this.getInvoices(0, 1000, filter);
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const summary: InvoiceSummary = {
      totalOutstanding: 0,
      paidThisMonth: 0,
      overdueAmount: 0,
      averagePaymentTime: 0,
      totalInvoices: invoices.content.length,
      paidInvoices: 0,
      unpaidInvoices: 0,
      overdueInvoices: 0,
    };

    let totalPaymentTime = 0;
    let paidCount = 0;

    invoices.content.forEach((invoice) => {
      switch (invoice.status) {
        case InvoiceStatus.PAID:
          summary.paidInvoices++;
          
          if (invoice.paidDate) {
            const paidDate = new Date(invoice.paidDate);
            if (paidDate >= thisMonthStart) {
              summary.paidThisMonth += invoice.totalAmount;
            }
            
            const createdDate = new Date(invoice.createdAt || invoice.dueDate);
            const paymentTime = Math.ceil(
              (paidDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            totalPaymentTime += paymentTime;
            paidCount++;
          }
          break;
          
        case InvoiceStatus.OVERDUE:
          summary.overdueInvoices++;
          summary.overdueAmount += invoice.totalAmount;
          summary.totalOutstanding += invoice.totalAmount;
          summary.unpaidInvoices++;
          break;
          
        case InvoiceStatus.CANCELLED:
          // Don't count cancelled invoices
          break;
          
        default:
          // All other statuses (DRAFT, SENT, VIEWED, PARTIAL_PAID, DISPUTED)
          summary.unpaidInvoices++;
          summary.totalOutstanding += invoice.totalAmount;
          break;
      }
    });

    summary.averagePaymentTime = paidCount > 0 ? Math.round(totalPaymentTime / paidCount) : 0;

    return summary;
  },

  async downloadInvoice(id: string): Promise<Blob> {
    const response = await ApiClient.get<Blob>(`/invoices/${id}/download`, {
      responseType: 'blob',
    });
    return response;
  },

  async bulkUpdateStatus(invoiceIds: string[], status: InvoiceStatus): Promise<void> {
    await Promise.all(invoiceIds.map((id) => this.updateInvoiceStatus(id, status)));
  },
};