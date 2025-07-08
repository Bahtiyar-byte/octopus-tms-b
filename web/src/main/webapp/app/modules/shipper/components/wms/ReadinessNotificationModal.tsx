import React, { useState } from 'react';
import { X, Send, Truck, Package, Calendar, AlertCircle } from 'lucide-react';
import { ShipmentReadiness } from '../../types/wms.types';
import { toast } from 'react-hot-toast';

interface ReadinessNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  readiness: ShipmentReadiness;
  onSendNotification: (data: {
    recipients: string[];
    estimatedPickupTime: string;
    specialInstructions?: string;
    createLoad: boolean;
  }) => Promise<void>;
}

export const ReadinessNotificationModal: React.FC<ReadinessNotificationModalProps> = ({
  isOpen,
  onClose,
  readiness,
  onSendNotification
}) => {
  const [recipients, setRecipients] = useState<string>('tms@company.com');
  const [estimatedPickupTime, setEstimatedPickupTime] = useState(
    new Date(Date.now() + 7200000).toISOString().slice(0, 16) // 2 hours from now
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [createLoad, setCreateLoad] = useState(true);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await onSendNotification({
        recipients: recipients.split(',').map(r => r.trim()),
        estimatedPickupTime,
        specialInstructions,
        createLoad
      });
      
      toast.success(
        createLoad 
          ? 'TMS notified and load created successfully!' 
          : 'TMS notified successfully!'
      );
      onClose();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const readyItems = readiness.items.filter(item => 
    item.status === 'picked' || item.status === 'packed'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Send Readiness Notification</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">
                  Shipment {readiness.status === 'ready' ? 'Ready' : 'Partially Ready'} for Pickup
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {readiness.orderId && `Order ID: ${readiness.orderId} • `}
                  {readyItems.length} of {readiness.items.length} items ready
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients (comma-separated emails)
              </label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tms@company.com, dispatch@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Pickup Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={estimatedPickupTime}
                  onChange={(e) => setEstimatedPickupTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions (optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional pickup instructions or requirements..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Ready Items Summary</h4>
              <div className="space-y-2">
                {readiness.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{item.name} ({item.sku})</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">
                        {item.pickedQuantity}/{item.requiredQuantity} ready
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.status === 'picked' || item.status === 'packed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={createLoad}
                  onChange={(e) => setCreateLoad(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <div>
                  <span className="font-medium text-green-900">Create Load/Order in TMS</span>
                  <p className="text-sm text-green-700 mt-0.5">
                    Automatically create a new load or order in the TMS based on this shipment readiness
                  </p>
                </div>
              </label>
            </div>

            {readiness.specialInstructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Original Special Instructions</p>
                    <p className="text-sm text-yellow-700 mt-0.5">{readiness.specialInstructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};