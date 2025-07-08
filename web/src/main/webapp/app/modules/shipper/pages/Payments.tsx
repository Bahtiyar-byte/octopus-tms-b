import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { notify } from '../../../services';
import { DataTable } from '../../../components/tables/DataTable';

interface Invoice {
  id: string;
  invoiceNumber: string;
  brokerName: string;
  brokerCompany: string;
  loadNumbers: string[];
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'overdue' | 'paid' | 'partial';
  paymentMethod?: string;
  lastPaymentDate?: string;
  remainingBalance?: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  status: 'completed' | 'pending' | 'failed';
}

const ShipperPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'wire' | 'check' | 'credit_card'>('ach');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      brokerName: 'John Smith',
      brokerCompany: 'ABC Logistics',
      loadNumbers: ['LOAD001', 'LOAD002'],
      issueDate: '2024-05-01',
      dueDate: '2024-05-31',
      amount: 5850.00,
      status: 'pending'
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      brokerName: 'Sarah Johnson',
      brokerCompany: 'XYZ Freight',
      loadNumbers: ['LOAD003'],
      issueDate: '2024-04-15',
      dueDate: '2024-05-15',
      amount: 3200.00,
      status: 'overdue'
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2024-003',
      brokerName: 'Mike Davis',
      brokerCompany: 'Quick Transport',
      loadNumbers: ['LOAD004', 'LOAD005', 'LOAD006'],
      issueDate: '2024-04-01',
      dueDate: '2024-05-01',
      amount: 8750.00,
      status: 'partial',
      remainingBalance: 4000.00,
      lastPaymentDate: '2024-04-25'
    },
    {
      id: 'INV004',
      invoiceNumber: 'INV-2024-004',
      brokerName: 'Lisa Brown',
      brokerCompany: 'Express Logistics',
      loadNumbers: ['LOAD007'],
      issueDate: '2024-03-15',
      dueDate: '2024-04-15',
      amount: 2100.00,
      status: 'paid',
      paymentMethod: 'ACH Transfer',
      lastPaymentDate: '2024-04-10'
    }
  ];

  const mockPayments: Payment[] = [
    {
      id: 'PAY001',
      invoiceId: 'INV004',
      invoiceNumber: 'INV-2024-004',
      amount: 2100.00,
      paymentDate: '2024-04-10',
      paymentMethod: 'ACH Transfer',
      referenceNumber: 'ACH-2024041001',
      status: 'completed'
    },
    {
      id: 'PAY002',
      invoiceId: 'INV003',
      invoiceNumber: 'INV-2024-003',
      amount: 4750.00,
      paymentDate: '2024-04-25',
      paymentMethod: 'Wire Transfer',
      referenceNumber: 'WIRE-2024042501',
      status: 'completed'
    }
  ];

  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [payments] = useState<Payment[]>(mockPayments);

  // Calculate totals
  const totalPending = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.remainingBalance || inv.amount), 0);

  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = payments
    .filter(pay => pay.status === 'completed')
    .reduce((sum, pay) => sum + pay.amount, 0);

  // Handle invoice selection
  const handleInvoiceSelect = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };


  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (selectedInvoices.length === 0) {
      notify('Please select at least one invoice to pay', 'error');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      notify('Please enter a valid payment amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notify('Payment processed successfully', 'success');
      setShowPaymentModal(false);
      setSelectedInvoices([]);
      setPaymentAmount('');
    } catch (error) {
      notify('Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle view invoice
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Handle pay single invoice
  const handlePaySingleInvoice = (invoice: Invoice) => {
    setSelectedInvoices([invoice.id]);
    setPaymentAmount((invoice.remainingBalance || invoice.amount).toString());
    setShowPaymentModal(true);
  };

  // Calculate selected total
  const selectedTotal = selectedInvoices.reduce((sum, invId) => {
    const invoice = invoices.find(inv => inv.id === invId);
    return sum + (invoice?.remainingBalance || invoice?.amount || 0);
  }, 0);

  // Invoice columns
  const invoiceColumns = [
    {
      key: 'select',
      label: '',
      render: (invoice: Invoice) => (
        <input
          type="checkbox"
          checked={selectedInvoices.includes(invoice.id)}
          onChange={() => handleInvoiceSelect(invoice.id)}
          disabled={invoice.status === 'paid'}
          className="rounded border-gray-300"
        />
      ),
      className: 'w-12'
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (invoice: Invoice) => (
        <button
          onClick={() => handleViewInvoice(invoice)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {invoice.invoiceNumber}
        </button>
      )
    },
    {
      key: 'broker',
      label: 'Broker',
      render: (invoice: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{invoice.brokerCompany}</div>
          <div className="text-sm text-gray-500">{invoice.brokerName}</div>
        </div>
      )
    },
    {
      key: 'loads',
      label: 'Loads',
      render: (invoice: Invoice) => (
        <div className="text-sm">
          {invoice.loadNumbers.length} load{invoice.loadNumbers.length > 1 ? 's' : ''}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (invoice: Invoice) => (
        <div>
          <div className="font-medium">${invoice.amount.toLocaleString()}</div>
          {invoice.remainingBalance && (
            <div className="text-sm text-orange-600">
              Balance: ${invoice.remainingBalance.toLocaleString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (invoice: Invoice) => (
        <div className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
          {new Date(invoice.dueDate).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (invoice: Invoice) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (invoice: Invoice) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewInvoice(invoice)}
            className="text-gray-600 hover:text-gray-800"
            title="View Invoice"
          >
            <i className="fas fa-eye"></i>
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={() => handlePaySingleInvoice(invoice)}
              className="text-green-600 hover:text-green-800"
              title="Pay Invoice"
            >
              <i className="fas fa-credit-card"></i>
            </button>
          )}
          <button
            className="text-gray-600 hover:text-gray-800"
            title="Download PDF"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      )
    }
  ];

  // Payment columns
  const paymentColumns = [
    {
      key: 'referenceNumber',
      label: 'Reference #',
      render: (payment: Payment) => (
        <span className="font-medium text-gray-900">{payment.referenceNumber}</span>
      )
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (payment: Payment) => (
        <span className="text-blue-600">{payment.invoiceNumber}</span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (payment: Payment) => (
        <span className="font-medium">${payment.amount.toLocaleString()}</span>
      )
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (payment: Payment) => new Date(payment.paymentDate).toLocaleDateString()
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (payment: Payment) => payment.paymentMethod
    },
    {
      key: 'status',
      label: 'Status',
      render: (payment: Payment) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <button
            className="text-gray-600 hover:text-gray-800"
            title="View Receipt"
          >
            <i className="fas fa-receipt"></i>
          </button>
          <button
            className="text-gray-600 hover:text-gray-800"
            title="Download"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage invoices and payments to brokers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-700">${totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-red-200 p-3 rounded-full">
              <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Overdue</p>
              <p className="text-2xl font-bold text-orange-700">${totalOverdue.toLocaleString()}</p>
            </div>
            <div className="bg-orange-200 p-3 rounded-full">
              <i className="fas fa-clock text-orange-600 text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Paid (MTD)</p>
              <p className="text-2xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Next Payment Due</p>
              <p className="text-lg font-bold text-blue-700">May 15, 2024</p>
              <p className="text-sm text-blue-600">$3,200.00</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <i className="fas fa-calendar-alt text-blue-600 text-xl"></i>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-file-invoice mr-2"></i>
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-history mr-2"></i>
            Payment History
          </button>
        </div>

        {activeTab === 'invoices' && selectedInvoices.length > 0 && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-credit-card mr-2"></i>
            Pay Selected ({selectedInvoices.length})
          </button>
        )}
      </div>

      {/* Content */}
      <Card>
        {activeTab === 'invoices' ? (
          <>
            {selectedInvoices.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">
                    {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
                  </span>
                  <span className="font-bold text-blue-800">
                    Total: ${selectedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <DataTable
              data={invoices}
              columns={invoiceColumns}
            />
          </>
        ) : (
          <DataTable
            data={payments}
            columns={paymentColumns}
          />
        )}
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Process Payment"
        size="lg"
      >
        <div className="space-y-6">
          {/* Selected Invoices Summary */}
          <div>
            <h3 className="text-lg font-medium mb-3">Selected Invoices</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {selectedInvoices.map(invId => {
                const invoice = invoices.find(inv => inv.id === invId);
                if (!invoice) return null;
                return (
                  <div key={invId} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                      <span className="text-gray-500 ml-2">- {invoice.brokerCompany}</span>
                    </div>
                    <span className="font-medium">
                      ${(invoice.remainingBalance || invoice.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Total Amount:</span>
                <span className="text-lg">${selectedTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'ach', label: 'ACH Transfer', icon: 'fa-university' },
                { value: 'wire', label: 'Wire Transfer', icon: 'fa-exchange-alt' },
                { value: 'check', label: 'Check', icon: 'fa-money-check' },
                { value: 'credit_card', label: 'Credit Card', icon: 'fa-credit-card' }
              ].map(method => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value as 'ach' | 'wire' | 'check' | 'credit_card')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <i className={`fas ${method.icon}`}></i>
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <button
              onClick={() => setPaymentAmount(selectedTotal.toString())}
              className="text-blue-600 text-sm mt-1 hover:text-blue-700"
            >
              Pay full amount (${selectedTotal.toLocaleString()})
            </button>
          </div>

          {/* Payment Details (based on method) */}
          {paymentMethod === 'ach' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Business Checking ****1234</option>
                  <option>Business Savings ****5678</option>
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <i className="fas fa-info-circle mr-2"></i>
                ACH transfers typically process within 1-2 business days
              </div>
            </div>
          )}

          {paymentMethod === 'wire' && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <h4 className="font-medium mb-2">Wire Transfer Instructions</h4>
              <div className="space-y-1">
                <div><span className="font-medium">Bank:</span> First National Bank</div>
                <div><span className="font-medium">Routing:</span> 123456789</div>
                <div><span className="font-medium">Account:</span> 987654321</div>
                <div><span className="font-medium">Reference:</span> Include invoice numbers</div>
              </div>
            </div>
          )}

          {paymentMethod === 'credit_card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Credit card payments incur a 2.9% processing fee
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Process Payment
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedInvoice.invoiceNumber}</h2>
                  <p className="text-gray-600">Issued: {new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedInvoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Broker Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Broker</h3>
                <div className="text-gray-900">
                  <p className="font-medium">{selectedInvoice.brokerCompany}</p>
                  <p>{selectedInvoice.brokerName}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Terms</h3>
                <div className="text-gray-900">
                  <p>Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  <p className={selectedInvoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                    {selectedInvoice.status === 'overdue' ? 'Overdue' : 'Net 30'}
                  </p>
                </div>
              </div>
            </div>

            {/* Load Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Associated Loads</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Load #</th>
                      <th className="pb-2">Route</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.loadNumbers.map((loadNum) => (
                      <tr key={loadNum} className="border-t">
                        <td className="py-2">{loadNum}</td>
                        <td className="py-2">Chicago, IL → New York, NY</td>
                        <td className="py-2 text-right">$2,925.00</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-medium">
                      <td colSpan={2} className="pt-2">Total</td>
                      <td className="pt-2 text-right">${selectedInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            {selectedInvoice.status === 'paid' && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-medium">Paid on:</span> {selectedInvoice.lastPaymentDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Method:</span> {selectedInvoice.paymentMethod}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <i className="fas fa-download mr-2"></i>
                Download PDF
              </button>
              {selectedInvoice.status !== 'paid' && (
                <button
                  onClick={() => {
                    handlePaySingleInvoice(selectedInvoice);
                    setShowInvoiceModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fas fa-credit-card mr-2"></i>
                  Pay Invoice
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShipperPayments;