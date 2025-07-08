import React from 'react';
import { toast } from 'react-hot-toast';

const BillingSettings: React.FC = () => {
  // Mock billing data
  const currentPlan = {
    name: 'Professional',
    price: '$49.99',
    billingCycle: 'monthly',
    nextBillingDate: 'June 15, 2023',
    features: [
      'Unlimited loads',
      'Up to 25 users',
      'Advanced reporting',
      'API access',
      'Email support'
    ]
  };

  const paymentMethod = {
    type: 'Credit Card',
    last4: '4242',
    expiry: '05/2025',
    name: 'John Doe'
  };

  const billingHistory = [
    { id: '1', date: 'May 15, 2023', amount: '$49.99', status: 'Paid', invoice: 'INV-2023-05' },
    { id: '2', date: 'April 15, 2023', amount: '$49.99', status: 'Paid', invoice: 'INV-2023-04' },
    { id: '3', date: 'March 15, 2023', amount: '$49.99', status: 'Paid', invoice: 'INV-2023-03' },
    { id: '4', date: 'February 15, 2023', amount: '$49.99', status: 'Paid', invoice: 'INV-2023-02' },
    { id: '5', date: 'January 15, 2023', amount: '$49.99', status: 'Paid', invoice: 'INV-2023-01' }
  ];

  const handleChangePlan = () => {
    toast.success('Opening plan selection dialog...');
  };

  const handleUpdatePaymentMethod = () => {
    toast.success('Opening payment method update dialog...');
  };

  const handleDownloadInvoice = (invoice: string) => {
    toast.success(`Downloading invoice ${invoice}...`);
    setTimeout(() => {
      toast.success('Invoice downloaded successfully');
    }, 1500);
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your subscription plan and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h4>
              <p className="text-gray-600 mt-1">
                {currentPlan.price} / {currentPlan.billingCycle}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Next billing date: {currentPlan.nextBillingDate}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                className="btn btn-primary"
                onClick={handleChangePlan}
              >
                Change Plan
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Plan Features:</h5>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-check text-green-500 mr-2"></i> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                <i className="fas fa-credit-card text-blue-600"></i>
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  {paymentMethod.type} ending in {paymentMethod.last4}
                </p>
                <p className="text-sm text-gray-500">
                  Expires {paymentMethod.expiry} • {paymentMethod.name}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                className="btn btn-white"
                onClick={handleUpdatePaymentMethod}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleDownloadInvoice(bill.invoice)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;