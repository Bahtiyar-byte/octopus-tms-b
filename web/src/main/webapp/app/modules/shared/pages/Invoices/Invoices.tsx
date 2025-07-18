import React, { useState } from 'react';
import {InvoiceUpdate, mockActions} from "../../../../services/mockActions";
import {Card, Modal} from "../../../../components";

interface Invoice {
    id: string;
    invoiceNumber: string;
    carrier: string;
    loadId: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    paidDate?: string;
}

interface InvoiceDetail extends Invoice {
    poNumber: string;
    carrierAddress: string;
    carrierEmail: string;
    carrierPhone: string;
    lineItems: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
    subtotal: number;
    tax: number;
    totalAmount: number;
    notes: string;
    attachments?: string[];
}

interface Carrier {
    name: string;
    amount: number;
    invoices: number;
}

const Invoices: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showCarrierModal, setShowCarrierModal] = useState(false);
    const [reminderEmail, setReminderEmail] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');

    // Invoice details for the modal
    const getInvoiceDetails = (invoice: Invoice): InvoiceDetail => {
        // In a real app, this would fetch from API
        return {
            ...invoice,
            poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
            carrierAddress: '456 Trucking Ave, Suite 200, Transport City, State 54321',
            carrierEmail: `billing@${invoice.carrier.toLowerCase().replace(/\s+/g, '')}.com`,
            carrierPhone: '(555) 987-6543',
            lineItems: [
                {
                    description: `Transportation Services - Load ${invoice.loadId}`,
                    quantity: 1,
                    rate: invoice.amount * 0.85,
                    amount: invoice.amount * 0.85
                },
                {
                    description: 'Fuel Surcharge',
                    quantity: 1,
                    rate: invoice.amount * 0.15,
                    amount: invoice.amount * 0.15
                }
            ],
            subtotal: invoice.amount,
            tax: 0,
            totalAmount: invoice.amount,
            notes: 'Payment terms: Net 30 days. Please include invoice number on remittance.',
            attachments: ['Rate_Confirmation.pdf', 'Proof_of_Delivery.pdf', 'Bill_of_Lading.pdf']
        };
    };

    const invoices: Invoice[] = [
        { id: '1', invoiceNumber: 'INV-2301', carrier: 'Fast Freight Inc', loadId: 'LD1001', date: '05/23/2025', dueDate: '06/22/2025', amount: 2850, status: 'unpaid' },
        { id: '2', invoiceNumber: 'INV-2302', carrier: 'Swift Transport', loadId: 'LD1002', date: '05/22/2025', dueDate: '06/21/2025', amount: 1950, status: 'unpaid' },
        { id: '3', invoiceNumber: 'INV-2303', carrier: 'Reliable Carriers', loadId: 'LD1003', date: '05/21/2025', dueDate: '06/20/2025', amount: 1750, status: 'unpaid' },
        { id: '4', invoiceNumber: 'INV-2304', carrier: 'Express Logistics', loadId: 'LD1004', date: '05/20/2025', dueDate: '06/19/2025', amount: 1795, status: 'paid', paidDate: '06/01/2025' },
        { id: '5', invoiceNumber: 'INV-2305', carrier: 'Prime Movers', loadId: 'LD1005', date: '05/19/2025', dueDate: '06/18/2025', amount: 2950, status: 'paid', paidDate: '05/30/2025' },
        { id: '6', invoiceNumber: 'INV-2295', carrier: 'National Freight', loadId: 'LD987', date: '04/15/2025', dueDate: '05/15/2025', amount: 2250, status: 'overdue' }
    ];

    const [invoicesState, setInvoicesState] = useState<Invoice[]>(invoices);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const filteredInvoices = invoicesState.filter(invoice => {
        const matchesQuery = searchQuery === '' ||
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.loadId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === '' || invoice.status === statusFilter;

        return matchesQuery && matchesStatus;
    });

    const getStatusBadgeClass = (status: string) => {
        switch(status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Summary metrics
    const totalOutstanding = invoicesState
        .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const paidThisMonth = invoicesState
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const overdue = invoicesState
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const unpaidCount = invoicesState.filter(inv => inv.status === 'unpaid').length;
    const paidCount = invoicesState.filter(inv => inv.status === 'paid').length;
    const overdueCount = invoicesState.filter(inv => inv.status === 'overdue').length;

    // Carrier data for the chart visualization
    const carrierData: Carrier[] = [
        { name: 'Fast Freight Inc', amount: 12850, invoices: 4 },
        { name: 'Swift Transport', amount: 18750, invoices: 5 },
        { name: 'Reliable Carriers', amount: 22350, invoices: 6 },
        { name: 'Others', amount: 24500, invoices: 10 }
    ];

    // Handle view invoice
    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
    };

    // Handle download invoice
    const handleDownloadInvoice = async (invoice: Invoice) => {
        setLoading(true);
        try {
            await mockActions.downloadInvoice(invoice.id);
        } catch (error) {
            console.error('Error downloading invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle mark as paid
    const handleMarkAsPaid = async (invoice: Invoice) => {
        setLoading(true);
        try {
            const updatedInvoice = await mockActions.markInvoiceAsPaid(invoice.id);

            // Update local state
            const updatedInvoices = invoicesState.map(inv =>
                inv.id === invoice.id ? { ...inv, status: 'paid' as const, paidDate: updatedInvoice.paidDate } : inv
            );

            setInvoicesState(updatedInvoices);
        } catch (error) {
            console.error('Error marking invoice as paid:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle send reminder
    const handleOpenReminderModal = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        const carrier = invoice.carrier.toLowerCase().replace(/\s+/g, '');
        setReminderEmail(`billing@${carrier}.com`);
        setReminderMessage(`This is a friendly reminder that invoice ${invoice.invoiceNumber} for $${invoice.amount} is now past due. Please submit payment at your earliest convenience.`);
        setShowReminderModal(true);
    };

    // Handle send reminder submit
    const handleSendReminder = async () => {
        if (!selectedInvoice) return;

        setLoading(true);
        try {
            await mockActions.sendInvoiceReminder(selectedInvoice.id);
            setShowReminderModal(false);
            setReminderEmail('');
            setReminderMessage('');
        } catch (error) {
            console.error('Error sending reminder:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle create new invoice
    const handleCreateInvoice = () => {
        setShowCreateModal(true);
    };

    // Handle view carrier details
    const handleViewCarrier = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setShowCarrierModal(true);
    };

    // Handle quick actions
    const handleSyncWithQuickBooks = async () => {
        setLoading(true);
        try {
            await mockActions.syncWithQuickBooks();
        } catch (error) {
            console.error('Error syncing with QuickBooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessBatchInvoices = async () => {
        setLoading(true);
        try {
            await mockActions.sendOverdueReminders();
        } catch (error) {
            console.error('Error processing batch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoiceReport = async () => {
        setLoading(true);
        try {
            await mockActions.downloadInvoiceReport();
        } catch (error) {
            console.error('Error downloading invoice report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIntegrateTriumphPay = async () => {
        setLoading(true);
        try {
            await mockActions.bulkUpdateInvoiceStatus('paid');
        } catch (error) {
            console.error('Error integrating with Triumph Pay:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-600">Manage carrier invoices and payments</p>
                </div>
                <div>
                    <button
                        className="btn btn-primary flex items-center"
                        onClick={handleCreateInvoice}
                        disabled={loading}
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        Create New Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="dashboard-card bg-gradient-blue">
                    <div className="card-body">
                        <i className="fas fa-file-invoice-dollar card-icon"></i>
                        <h5 className="card-title">Total Outstanding</h5>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(totalOutstanding)}</p>
                        <p className="text-sm mt-1 opacity-90">{unpaidCount + overdueCount} Unpaid Invoices</p>
                        <div className="mt-3 bg-blue-200 bg-opacity-30 rounded-full h-1.5">
                            <div
                                className="bg-white h-1.5 rounded-full"
                                style={{ width: '75%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card bg-gradient-green">
                    <div className="card-body">
                        <i className="fas fa-check-circle card-icon"></i>
                        <h5 className="card-title">Paid This Month</h5>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(paidThisMonth)}</p>
                        <p className="text-sm mt-1 opacity-90">{paidCount} Paid Invoices</p>
                        <div className="mt-3 bg-green-200 bg-opacity-30 rounded-full h-1.5">
                            <div
                                className="bg-white h-1.5 rounded-full"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card bg-gradient-red">
                    <div className="card-body">
                        <i className="fas fa-exclamation-triangle card-icon"></i>
                        <h5 className="card-title">Overdue</h5>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(overdue)}</p>
                        <p className="text-sm mt-1 opacity-90">{overdueCount} Overdue Invoices</p>
                        <div className="mt-3 bg-red-200 bg-opacity-30 rounded-full h-1.5">
                            <div
                                className="bg-white h-1.5 rounded-full"
                                style={{ width: '35%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card bg-gradient-orange">
                    <div className="card-body">
                        <i className="fas fa-clock card-icon"></i>
                        <h5 className="card-title">Average Payment Time</h5>
                        <p className="text-3xl font-bold mt-2">28</p>
                        <p className="text-sm mt-1 opacity-90">Days to Payment</p>
                        <div className="mt-3 bg-orange-200 bg-opacity-30 rounded-full h-1.5">
                            <div
                                className="bg-white h-1.5 rounded-full"
                                style={{ width: '55%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold flex items-center mb-4 md:mb-0">
                        <i className="fas fa-file-invoice-dollar mr-2 text-blue-600"></i>
                        Carrier Invoices
                    </h2>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search invoices..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            onClick={() => alert('Advanced filters would appear here')}
                        >
                            <i className="fas fa-filter mr-1"></i>
                            <span>More Filters</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Carrier
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Load ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewInvoice(invoice)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {invoice.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {invoice.carrier}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {invoice.loadId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {invoice.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {invoice.dueDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(invoice.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="btn-sm btn-outline-primary mr-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewInvoice(invoice);
                                        }}
                                        disabled={loading}
                                    >
                                        View
                                    </button>
                                    {invoice.status === 'paid' ? (
                                        <button
                                            className="btn-sm btn-outline-secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadInvoice(invoice);
                                            }}
                                            disabled={loading}
                                        >
                                            Download
                                        </button>
                                    ) : invoice.status === 'overdue' ? (
                                        <button
                                            className="btn-sm btn-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenReminderModal(invoice);
                                            }}
                                            disabled={loading}
                                        >
                                            Send Reminder
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-sm btn-outline-success"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsPaid(invoice);
                                            }}
                                            disabled={loading}
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            Showing <span className="font-medium">{filteredInvoices.length}</span> of <span className="font-medium">{invoicesState.length}</span> invoices
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold flex items-center mb-4">
                        <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
                        Invoice Summary by Carrier
                    </h2>

                    <Card className="shadow-sm h-full">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* This would be a chart in a real application */}
                            <div className="md:col-span-2 flex flex-col justify-center">
                                <div className="space-y-4 p-4">
                                    {carrierData.map((carrier, index) => {
                                        const colors = ['blue', 'green', 'purple', 'orange'];
                                        const color = colors[index % colors.length];
                                        const percentage = Math.round((carrier.amount / carrierData.reduce((sum, c) => sum + c.amount, 0)) * 100);

                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center">
                                                        <div className={`h-3 w-3 rounded-full bg-${color}-500 mr-2`}></div>
                                                        <span className="text-sm font-medium text-gray-700">{carrier.name}</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{formatCurrency(carrier.amount)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-gray-200 p-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Carrier
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount Due
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Invoices
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {carrierData.map((carrier, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handleViewCarrier(carrier)}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {carrier.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                                                    {formatCurrency(carrier.amount)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                                                    {carrier.invoices}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewCarrier(carrier);
                                                        }}
                                                        disabled={loading}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold flex items-center mb-4">
                        <i className="fas fa-bolt mr-2 text-blue-600"></i>
                        Quick Actions
                    </h2>

                    <Card className="shadow-sm mb-6">
                        <div className="space-y-1">
                            <button
                                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={handleSyncWithQuickBooks}
                                disabled={loading}
                            >
                                <div className="flex items-center">
                                    <i className="fas fa-sync text-green-500 mr-3"></i>
                                    <span className="font-medium">Sync with QuickBooks</span>
                                </div>
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </button>

                            <button
                                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={handleProcessBatchInvoices}
                                disabled={loading}
                            >
                                <div className="flex items-center">
                                    <i className="fas fa-money-check-alt text-blue-500 mr-3"></i>
                                    <span className="font-medium">Process Batch Invoices</span>
                                </div>
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </button>

                            <button
                                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={handleDownloadInvoiceReport}
                                disabled={loading}
                            >
                                <div className="flex items-center">
                                    <i className="fas fa-file-download text-purple-500 mr-3"></i>
                                    <span className="font-medium">Download Invoice Report</span>
                                </div>
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </button>

                            <button
                                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={handleIntegrateTriumphPay}
                                disabled={loading}
                            >
                                <div className="flex items-center">
                                    <i className="fas fa-link text-orange-500 mr-3"></i>
                                    <span className="font-medium">Integrate Triumph Pay</span>
                                </div>
                                <i className="fas fa-chevron-right text-gray-400"></i>
                            </button>
                        </div>
                    </Card>

                    <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                        <div className="p-6">
                            <div className="mb-4">
                                <i className="fas fa-chart-line text-4xl text-purple-500"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-purple-900 mb-2">Invoice Overview</h3>
                            <p className="text-purple-800 mb-4">
                                Your accounts payable has decreased by 12% compared to last month.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-800">30-day Payment Rate</span>
                                        <span className="text-purple-900 font-medium">89%</span>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-2">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-800">Invoices Processed (This Month)</span>
                                        <span className="text-purple-900 font-medium">45</span>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="mt-6 inline-flex items-center px-4 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                onClick={() => alert('Full invoice report would be shown here')}
                            >
                                View Full Report
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <Modal
                    isOpen={showInvoiceModal}
                    onClose={() => setShowInvoiceModal(false)}
                    title={`Invoice ${selectedInvoice.invoiceNumber}`}
                    size="lg"
                    footer={
                        <div className="flex justify-end space-x-4">
                            {selectedInvoice.status === 'paid' ? (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                                    disabled={loading}
                                >
                                    Download Invoice
                                </button>
                            ) : selectedInvoice.status === 'overdue' ? (
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={() => {
                                        setShowInvoiceModal(false);
                                        handleOpenReminderModal(selectedInvoice);
                                    }}
                                    disabled={loading}
                                >
                                    Send Payment Reminder
                                </button>
                            ) : (
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    onClick={() => {
                                        handleMarkAsPaid(selectedInvoice);
                                        setShowInvoiceModal(false);
                                    }}
                                    disabled={loading}
                                >
                                    Mark as Paid
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setShowInvoiceModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    }
                >
                    <div className="bg-white p-6 rounded-lg">
                        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                                <p className="text-gray-600">#{selectedInvoice.invoiceNumber}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                                selectedInvoice.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : selectedInvoice.status === 'overdue'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {selectedInvoice.status.toUpperCase()}
                                {selectedInvoice.paidDate && ` - Paid on ${selectedInvoice.paidDate}`}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-gray-500 font-medium mb-2">Bill To:</h3>
                                <p className="font-medium text-gray-900">{selectedInvoice.carrier}</p>
                                <p className="text-gray-600">
                                    {getInvoiceDetails(selectedInvoice).carrierAddress}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    <strong>Email:</strong> {getInvoiceDetails(selectedInvoice).carrierEmail}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Phone:</strong> {getInvoiceDetails(selectedInvoice).carrierPhone}
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-left text-gray-500">Invoice Date:</div>
                                    <div className="text-right font-medium">{selectedInvoice.date}</div>

                                    <div className="text-left text-gray-500">Due Date:</div>
                                    <div className="text-right font-medium">{selectedInvoice.dueDate}</div>

                                    <div className="text-left text-gray-500">PO Number:</div>
                                    <div className="text-right font-medium">{getInvoiceDetails(selectedInvoice).poNumber}</div>

                                    <div className="text-left text-gray-500">Load ID:</div>
                                    <div className="text-right font-medium">{selectedInvoice.loadId}</div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rate
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getInvoiceDetails(selectedInvoice).lineItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {formatCurrency(item.rate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                            {formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                        Subtotal
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                        {formatCurrency(getInvoiceDetails(selectedInvoice).subtotal)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                        Tax
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                        {formatCurrency(getInvoiceDetails(selectedInvoice).tax)}
                                    </td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-bold text-gray-700">
                                        Total
                                    </td>
                                    <td className="px-6 py-3 text-right text-lg font-bold text-gray-900">
                                        {formatCurrency(getInvoiceDetails(selectedInvoice).totalAmount)}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-700 font-medium mb-2">Notes</h3>
                                <p className="text-gray-600">
                                    {getInvoiceDetails(selectedInvoice).notes}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-gray-700 font-medium mb-2">Attachments</h3>
                                <ul className="space-y-2">
                                    {getInvoiceDetails(selectedInvoice).attachments?.map((file, index) => (
                                        <li key={index} className="flex items-center">
                                            <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                                            <span className="text-gray-600">{file}</span>
                                            <button
                                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                onClick={() => alert(`Downloading ${file}`)}
                                            >
                                                Download
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Send Reminder Modal */}
            <Modal
                isOpen={showReminderModal}
                onClose={() => setShowReminderModal(false)}
                title="Send Payment Reminder"
                size="md"
                footer={
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={handleSendReminder}
                            disabled={loading}
                        >
                            Send Reminder
                        </button>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setShowReminderModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Recipient Email
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            type="email"
                            value={reminderEmail}
                            onChange={(e) => setReminderEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={5}
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                id="include-invoice"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                            />
                            <label htmlFor="include-invoice" className="ml-2 block text-sm text-gray-900">
                                Include invoice details (PDF)
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Create Invoice Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Invoice"
                size="lg"
                footer={
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                                alert('New invoice would be created here');
                                setShowCreateModal(false);
                            }}
                            disabled={loading}
                        >
                            Create Invoice
                        </button>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Carrier
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Carrier</option>
                                <option value="fast">Fast Freight Inc</option>
                                <option value="swift">Swift Transport</option>
                                <option value="reliable">Reliable Carriers</option>
                                <option value="express">Express Logistics</option>
                                <option value="prime">Prime Movers</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Load ID
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Load</option>
                                <option value="LD1001">LD1001 - Chicago to Dallas</option>
                                <option value="LD1002">LD1002 - New York to Miami</option>
                                <option value="LD1003">LD1003 - Los Angeles to Seattle</option>
                                <option value="LD1004">LD1004 - Boston to Washington DC</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                PO Number
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Optional PO Number"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-3">Line Items</h3>

                    <div className="border rounded-lg overflow-hidden mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Quantity
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Rate
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Amount
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue="Transportation Services"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                                        defaultValue="1"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                                        defaultValue="1500"
                                    />
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-medium">
                                    $1,500.00
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button className="text-red-600 hover:text-red-900">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue="Fuel Surcharge"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                                        defaultValue="1"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                                        defaultValue="250"
                                    />
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-medium">
                                    $250.00
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button className="text-red-600 hover:text-red-900">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-start mb-6">
                        <button className="flex items-center text-blue-600 hover:text-blue-800">
                            <i className="fas fa-plus-circle mr-1"></i>
                            Add Line Item
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Notes
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Optional notes to display on the invoice..."
                                defaultValue="Payment terms: Net 30 days. Please include invoice number on remittance."
                            />
                        </div>

                        <div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-sm font-medium">$1,750.00</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Tax</span>
                                    <span className="text-sm font-medium">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-base font-medium text-gray-700">Total</span>
                                    <span className="text-lg font-bold text-gray-900">$1,750.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Carrier Detail Modal */}
            <Modal
                isOpen={showCarrierModal}
                onClose={() => setShowCarrierModal(false)}
                title={selectedCarrier?.name || 'Carrier Details'}
                size="lg"
                footer={
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                                alert('Carrier statement would be downloaded here');
                            }}
                            disabled={loading}
                        >
                            Download Statement
                        </button>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setShowCarrierModal(false)}
                        >
                            Close
                        </button>
                    </div>
                }
            >
                {selectedCarrier && (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-blue-800 mb-1">Total Outstanding</h3>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(selectedCarrier.amount)}</p>
                                <p className="text-sm text-blue-700">{selectedCarrier.invoices} Active Invoices</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h3 className="font-medium text-green-800 mb-1">Average Payment Time</h3>
                                <p className="text-2xl font-bold text-green-900">24 Days</p>
                                <p className="text-sm text-green-700">Improved by 4 days</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h3 className="font-medium text-purple-800 mb-1">YTD Payments</h3>
                                <p className="text-2xl font-bold text-purple-900">{formatCurrency(selectedCarrier.amount * 2.5)}</p>
                                <p className="text-sm text-purple-700">+15% year over year</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-3">Outstanding Invoices</h3>

                        <div className="overflow-x-auto border rounded-lg mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {/* Generate some sample invoices based on the selected carrier */}
                                {Array.from({ length: 3 }).map((_, index) => {
                                    const status = index === 0 ? 'overdue' : index === 1 ? 'unpaid' : 'unpaid';
                                    const daysAgo = index * 10 + 5;
                                    const date = new Date();
                                    date.setDate(date.getDate() - daysAgo);
                                    const dueDate = new Date(date);
                                    dueDate.setDate(dueDate.getDate() + 30);

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                INV-{2300 + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {date.toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {dueDate.toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {formatCurrency(Math.round((selectedCarrier.amount / selectedCarrier.invoices) * (index + 0.8)))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="btn-sm btn-outline-primary mr-2">
                                                    View
                                                </button>
                                                {status === 'overdue' ? (
                                                    <button className="btn-sm btn-outline-danger">
                                                        Remind
                                                    </button>
                                                ) : (
                                                    <button className="btn-sm btn-outline-success">
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-gray-700 mb-1"><strong>Billing Contact:</strong> Mike Johnson</p>
                                <p className="text-gray-700 mb-1"><strong>Email:</strong> billing@{selectedCarrier.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                                <p className="text-gray-700 mb-1"><strong>Phone:</strong> (555) 987-6543</p>
                                <p className="text-gray-700 mb-1"><strong>Address:</strong> 456 Trucking Ave, Suite 200, Transport City, ST 54321</p>
                            </div>
                            <div>
                                <p className="text-gray-700 mb-1"><strong>Account Manager:</strong> David Wilson</p>
                                <p className="text-gray-700 mb-1"><strong>Payment Terms:</strong> Net 30</p>
                                <p className="text-gray-700 mb-1"><strong>Preferred Method:</strong> ACH Transfer</p>
                                <p className="text-gray-700 mb-1"><strong>Carrier Since:</strong> Jan 2022</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Activity</h3>

                        <div className="border rounded-lg overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                <div className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 rounded-full p-2 mr-3">
                                            <i className="fas fa-check text-green-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Invoice INV-2290 paid</p>
                                            <p className="text-xs text-gray-500">May 01, 2025 • {formatCurrency(1850)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                                            <i className="fas fa-paper-plane text-blue-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Invoice INV-2295 sent</p>
                                            <p className="text-xs text-gray-500">April 15, 2025 • {formatCurrency(2250)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="bg-purple-100 rounded-full p-2 mr-3">
                                            <i className="fas fa-truck text-purple-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">New load completed</p>
                                            <p className="text-xs text-gray-500">April 10, 2025 • Load LD-1234</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Invoices;