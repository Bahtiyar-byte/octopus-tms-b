import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { invoiceService } from "../../../../services";
import {Card, Modal} from "../../../../components";
import { formatCurrency } from '../../../../utils';
import { Invoice, InvoiceStatus, InvoiceSummary } from '../../../../types/core/invoice.types';

interface Carrier {
    id: string;
    name: string;
    amount: number;
    invoices: number;
}

const Invoices: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [summary, setSummary] = useState<InvoiceSummary | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showCarrierModal, setShowCarrierModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [reminderEmail, setReminderEmail] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');

    useEffect(() => {
        loadInvoices();
        loadSummary();
    }, [searchQuery, statusFilter, currentPage]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const filter = {
                ...(statusFilter && { status: statusFilter as InvoiceStatus })
            };
            const response = await invoiceService.getInvoices(currentPage, 20, filter);
            const filteredInvoices = response.content.filter(invoice => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return invoice.invoiceNumber.toLowerCase().includes(query) ||
                       invoice.loadId.toLowerCase().includes(query);
            });
            setInvoices(filteredInvoices);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const summaryData = await invoiceService.getInvoiceSummary();
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load summary:', error);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch(status) {
            case InvoiceStatus.PAID:
                return 'bg-green-100 text-green-800';
            case InvoiceStatus.DRAFT:
            case InvoiceStatus.SENT:
            case InvoiceStatus.VIEWED:
                return 'bg-yellow-100 text-yellow-800';
            case InvoiceStatus.OVERDUE:
            case InvoiceStatus.DISPUTED:
                return 'bg-red-100 text-red-800';
            case InvoiceStatus.PARTIAL_PAID:
                return 'bg-blue-100 text-blue-800';
            case InvoiceStatus.CANCELLED:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleViewInvoice = async (invoice: Invoice) => {
        setLoading(true);
        try {
            const fullInvoice = await invoiceService.getInvoiceById(invoice.id);
            setSelectedInvoice(fullInvoice);
            setShowInvoiceModal(true);
        } catch (error) {
            toast.error('Failed to load invoice details');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (invoice: Invoice) => {
        setLoading(true);
        try {
            const blob = await invoiceService.downloadInvoice(invoice.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Invoice downloaded successfully');
        } catch (error) {
            toast.error('Failed to download invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (invoice: Invoice) => {
        setLoading(true);
        try {
            await invoiceService.markInvoiceAsPaid(invoice.id, 'Check', `CHK-${Date.now()}`);
            toast.success('Invoice marked as paid');
            await loadInvoices();
            await loadSummary();
        } catch (error) {
            toast.error('Failed to update invoice status');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReminderModal = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setReminderEmail(`billing@company.com`);
        setReminderMessage(`This is a friendly reminder that invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.totalAmount)} is now past due. Please submit payment at your earliest convenience.`);
        setShowReminderModal(true);
    };

    const handleSendReminder = async () => {
        if (!selectedInvoice) return;

        setLoading(true);
        try {
            await invoiceService.sendInvoice(selectedInvoice.id);
            toast.success('Reminder sent successfully');
            setShowReminderModal(false);
            setReminderEmail('');
            setReminderMessage('');
        } catch (error) {
            toast.error('Failed to send reminder');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = () => {
        setShowCreateModal(true);
    };

    const carrierData: Carrier[] = [
        { id: '1', name: 'Fast Freight Inc', amount: 12850, invoices: 4 },
        { id: '2', name: 'Swift Transport', amount: 18750, invoices: 5 },
        { id: '3', name: 'Reliable Carriers', amount: 22350, invoices: 6 },
        { id: '4', name: 'Others', amount: 24500, invoices: 10 }
    ];

    const handleViewCarrier = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setShowCarrierModal(true);
    };

    const handleSyncWithQuickBooks = async () => {
        toast('QuickBooks sync feature coming soon', { icon: 'ℹ️' });
    };

    const handleProcessBatchInvoices = async () => {
        toast('Batch processing feature coming soon', { icon: 'ℹ️' });
    };

    const handleDownloadInvoiceReport = async () => {
        toast('Report download feature coming soon', { icon: 'ℹ️' });
    };

    const handleIntegrateTriumphPay = async () => {
        toast('Triumph Pay integration coming soon', { icon: 'ℹ️' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Invoices & Payments</h1>
                    <p className="text-gray-600">Manage your invoices and track payments</p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Total Outstanding</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(summary?.totalOutstanding || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {summary?.unpaidInvoices || 0} unpaid invoices
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <i className="fas fa-dollar-sign text-red-600"></i>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Paid This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(summary?.paidThisMonth || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {summary?.paidInvoices || 0} invoices
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <i className="fas fa-check-circle text-green-600"></i>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(summary?.overdueAmount || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {summary?.overdueInvoices || 0} overdue
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <i className="fas fa-exclamation-triangle text-orange-600"></i>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Avg Payment Time</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {summary?.averagePaymentTime || 0} days
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <i className="fas fa-clock text-blue-600"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Invoices Table */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Recent Invoices</h2>
                                    <button
                                        onClick={handleCreateInvoice}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <i className="fas fa-plus mr-2"></i>
                                        Create Invoice
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Search invoices..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value={InvoiceStatus.DRAFT}>Draft</option>
                                        <option value={InvoiceStatus.SENT}>Sent</option>
                                        <option value={InvoiceStatus.VIEWED}>Viewed</option>
                                        <option value={InvoiceStatus.PAID}>Paid</option>
                                        <option value={InvoiceStatus.PARTIAL_PAID}>Partial Paid</option>
                                        <option value={InvoiceStatus.OVERDUE}>Overdue</option>
                                        <option value={InvoiceStatus.DISPUTED}>Disputed</option>
                                        <option value={InvoiceStatus.CANCELLED}>Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Invoices Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice #</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Load ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    Loading invoices...
                                                </td>
                                            </tr>
                                        ) : invoices.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                                    No invoices found
                                                </td>
                                            </tr>
                                        ) : (
                                            invoices.map((invoice) => (
                                                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => handleViewInvoice(invoice)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {invoice.invoiceNumber}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-4">{invoice.loadId.substring(0, 8)}</td>
                                                    <td className="py-3 px-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4 text-right font-medium">
                                                        {formatCurrency(invoice.totalAmount)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDownloadInvoice(invoice)}
                                                                className="text-gray-600 hover:text-gray-800"
                                                                title="Download"
                                                            >
                                                                <i className="fas fa-download"></i>
                                                            </button>
                                                            {invoice.status !== InvoiceStatus.PAID && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleMarkAsPaid(invoice)}
                                                                        className="text-green-600 hover:text-green-800"
                                                                        title="Mark as Paid"
                                                                    >
                                                                        <i className="fas fa-check-circle"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleOpenReminderModal(invoice)}
                                                                        className="text-orange-600 hover:text-orange-800"
                                                                        title="Send Reminder"
                                                                    >
                                                                        <i className="fas fa-bell"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 rounded border disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {currentPage + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-3 py-1 rounded border disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Invoice Summary */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Invoice Summary by Carrier</h3>
                            <div className="space-y-3">
                                {carrierData.map((carrier) => (
                                    <div
                                        key={carrier.id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleViewCarrier(carrier)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{carrier.name}</h4>
                                                <p className="text-sm text-gray-600">{carrier.invoices} invoices</p>
                                            </div>
                                            <p className="font-semibold">{formatCurrency(carrier.amount)}</p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(carrier.amount / 25000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleSyncWithQuickBooks}
                                    className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fab fa-quickbooks text-green-600 mr-3"></i>
                                    Sync with QuickBooks
                                </button>
                                <button
                                    onClick={handleProcessBatchInvoices}
                                    className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fas fa-envelope text-blue-600 mr-3"></i>
                                    Send Overdue Reminders
                                </button>
                                <button
                                    onClick={handleDownloadInvoiceReport}
                                    className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fas fa-file-excel text-green-600 mr-3"></i>
                                    Download Invoice Report
                                </button>
                                <button
                                    onClick={handleIntegrateTriumphPay}
                                    className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fas fa-university text-purple-600 mr-3"></i>
                                    Triumph Pay Integration
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {showInvoiceModal && selectedInvoice && (
                <Modal
                    isOpen={showInvoiceModal}
                    onClose={() => setShowInvoiceModal(false)}
                    title={`Invoice ${selectedInvoice.invoiceNumber}`}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Invoice Date</p>
                                <p className="font-medium">{new Date(selectedInvoice.createdAt || '').toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Due Date</p>
                                <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedInvoice.status)}`}>
                                    {selectedInvoice.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="font-semibold text-lg">{formatCurrency(selectedInvoice.totalAmount)}</p>
                            </div>
                        </div>

                        {selectedInvoice.notes && (
                            <div>
                                <p className="text-sm text-gray-600">Notes</p>
                                <p className="mt-1">{selectedInvoice.notes}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => handleDownloadInvoice(selectedInvoice)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <i className="fas fa-download mr-2"></i>
                                Download PDF
                            </button>
                            {selectedInvoice.status !== InvoiceStatus.PAID && (
                                <button
                                    onClick={() => handleMarkAsPaid(selectedInvoice)}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <i className="fas fa-check-circle mr-2"></i>
                                    Mark as Paid
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Send Reminder Modal */}
            {showReminderModal && selectedInvoice && (
                <Modal
                    isOpen={showReminderModal}
                    onClose={() => setShowReminderModal(false)}
                    title="Send Payment Reminder"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                            <input
                                type="email"
                                value={reminderEmail}
                                onChange={(e) => setReminderEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                            <textarea
                                value={reminderMessage}
                                onChange={(e) => setReminderMessage(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSendReminder}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={loading}
                            >
                                <i className="fas fa-paper-plane mr-2"></i>
                                Send Reminder
                            </button>
                            <button
                                onClick={() => setShowReminderModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Carrier Detail Modal */}
            {showCarrierModal && selectedCarrier && (
                <Modal
                    isOpen={showCarrierModal}
                    onClose={() => setShowCarrierModal(false)}
                    title={selectedCarrier.name}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Total Outstanding</p>
                                <p className="font-semibold text-lg">{formatCurrency(selectedCarrier.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Invoices</p>
                                <p className="font-semibold text-lg">{selectedCarrier.invoices}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={() => setShowCarrierModal(false)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New Invoice"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">Invoice creation form would go here...</p>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Invoices;