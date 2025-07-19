import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components';
import { mockActions, notify } from '../services';

// Define load data types
interface Load {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  equipment: string;
  date: string;
  price: number;
  driver?: string;
  status: 'Posted' | 'Booked' | 'Assigned' | 'En Route' | 'Picked Up' | 'Delivered' | 'Awaiting Docs' | 'Paid';
  eta?: string;
  pickupDate?: string;
  deliveryDate?: string;
  miles?: number;
  weight?: string;
  broker?: string;
  notes?: string;
  documents?: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  path: string | null;
}

const LoadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [load, setLoad] = useState<Load | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [previewingDoc, setPreviewingDoc] = useState<string | null>(null);

  // Fetch load details
  useEffect(() => {
    const fetchLoadDetails = async () => {
      setLoading(true);
      try {
        // Check if load data was passed through navigation state
        if (location.state?.load) {
          // Transform broker load data to LoadDetails format
          const brokerLoad = location.state.load;
          const transformedLoad: Load = {
            id: brokerLoad.id,
            origin: brokerLoad.origin,
            destination: brokerLoad.destination,
            customer: 'Acme Corporation', // Mock customer name
            equipment: brokerLoad.equipmentType,
            date: brokerLoad.pickupDate,
            price: parseFloat(brokerLoad.rate),
            status: brokerLoad.status as 'Posted' | 'Booked' | 'Assigned' | 'En Route' | 'Picked Up' | 'Delivered' | 'Awaiting Docs' | 'Paid',
            miles: Math.floor(Math.random() * 500) + 300, // Mock miles
            weight: brokerLoad.weight + ' lbs',
            broker: brokerLoad.carrier || 'ABC Logistics',
            notes: 'Customer requires delivery confirmation. Call ahead 2 hours before arrival.',
            pickupDate: brokerLoad.pickupDate,
            deliveryDate: brokerLoad.deliveryDate,
            driver: brokerLoad.status !== 'Posted' ? 'John Doe' : undefined,
            eta: brokerLoad.status === 'En Route' ? new Date(brokerLoad.deliveryDate).toLocaleString() : undefined,
            documents: [
              {
                id: 'DOC1001',
                name: 'Bill of Lading',
                type: 'Image',
                uploadDate: new Date(brokerLoad.pickupDate).toLocaleDateString(),
                size: '1.2 MB',
                path: '/sample-docs/BOL_sample.jpg'
              },
              {
                id: 'DOC1002',
                name: 'Rate Confirmation',
                type: 'Image',
                uploadDate: new Date(brokerLoad.pickupDate).toLocaleDateString(),
                size: '0.8 MB',
                path: '/sample-docs/rate_con.png'
              },
              {
                id: 'DOC1003',
                name: 'Proof of Delivery',
                type: 'PDF',
                uploadDate: brokerLoad.status === 'Delivered' ? new Date(brokerLoad.deliveryDate).toLocaleDateString() : 'Pending',
                size: '2.4 MB',
                path: null // Will be generated dynamically
              }
            ]
          };
          setLoad(transformedLoad);
        } else {
          // Fallback to mock data if no state was passed
          await new Promise(resolve => setTimeout(resolve, 800));

          const mockLoad: Load = {
            id: id || 'LD1001',
            origin: 'New York, NY',
            destination: 'Chicago, IL',
            customer: 'Acme Co',
            equipment: 'Dry Van',
            date: '5/22/2025',
            price: 2850,
            status: 'Booked',
            miles: 750,
            weight: '42,000 lbs',
            broker: 'ABC Logistics',
            notes: 'Customer requires delivery confirmation. Call ahead 2 hours before arrival.',
            documents: [
              {
                id: 'DOC1001',
                name: 'Bill of Lading',
                type: 'Image',
                uploadDate: '5/22/2025',
                size: '1.2 MB',
                path: '/sample-docs/BOL_sample.jpg'
              },
              {
                id: 'DOC1002',
                name: 'Rate Confirmation',
                type: 'Image',
                uploadDate: '5/21/2025',
                size: '0.8 MB',
                path: '/sample-docs/rate_con.png'
              },
              {
                id: 'DOC1003',
                name: 'Proof of Delivery',
                type: 'PDF',
                uploadDate: '5/24/2025',
                size: '2.4 MB',
                path: null // Will be generated dynamically
              }
            ]
          };

          setLoad(mockLoad);
        }
      } catch (error) {
        notify('Error fetching load details. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLoadDetails();
  }, [id, location.state]);

  // Export to PDF
  const exportToPdf = async () => {
    setExportingPdf(true);
    try {
      // In a real app, this would use a library like jsPDF or call a backend API
      // For this implementation, we'll create a simple PDF-like view in a new window
      if (!load) return;

      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        notify('Please allow pop-ups to export PDF', 'error');
        return;
      }

      // Create a simple PDF-like layout
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Load Details - ${load.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; color: #2563eb; }
            .section { margin-bottom: 20px; }
            .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .item { margin-bottom: 10px; }
            .label { font-weight: bold; color: #666; }
            .value { }
            .status { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
            .status-booked { background-color: #6b7280; color: white; }
            .status-assigned { background-color: #2563eb; color: white; }
            .status-picked-up { background-color: #f59e0b; color: white; }
            .status-delivered { background-color: #10b981; color: white; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Octopus TMS</h1>
            <p>Load Details Report</p>
          </div>

          <div class="section">
            <h2>Load Information</h2>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3>Load ID: ${load.id}</h3>
              <span class="status status-${load.status.toLowerCase().replace(' ', '-')}">${load.status}</span>
            </div>
          </div>

          <div class="section grid">
            <div>
              <h2>Shipment Details</h2>
              <div class="item">
                <div class="label">Customer</div>
                <div class="value">${load.customer}</div>
              </div>
              <div class="item">
                <div class="label">Broker</div>
                <div class="value">${load.broker}</div>
              </div>
              <div class="item">
                <div class="label">Equipment</div>
                <div class="value">${load.equipment}</div>
              </div>
              <div class="item">
                <div class="label">Weight</div>
                <div class="value">${load.weight}</div>
              </div>
            </div>

            <div>
              <h2>Route Information</h2>
              <div class="item">
                <div class="label">Origin</div>
                <div class="value">${load.origin}</div>
              </div>
              <div class="item">
                <div class="label">Destination</div>
                <div class="value">${load.destination}</div>
              </div>
              <div class="item">
                <div class="label">Distance</div>
                <div class="value">${load.miles} miles</div>
              </div>
              <div class="item">
                <div class="label">Date</div>
                <div class="value">${load.date}</div>
              </div>
              ${load.eta ? `
              <div class="item">
                <div class="label">ETA</div>
                <div class="value">${load.eta}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <h2>Financial Details</h2>
            <div class="grid">
              <div class="item">
                <div class="label">Rate</div>
                <div class="value" style="font-size: 18px; color: #10b981;">$${load.price.toLocaleString()}</div>
              </div>
              <div class="item">
                <div class="label">Rate per Mile</div>
                <div class="value" style="font-size: 18px; color: #10b981;">$${load.miles ? (load.price / load.miles).toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>

          ${load.notes ? `
          <div class="section">
            <h2>Notes</h2>
            <div style="background-color: #fefce8; border-left: 4px solid #fbbf24; padding: 10px;">
              ${load.notes}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h2>Status Timeline</h2>
            <div class="item">
              <div class="label">Booked</div>
              <div class="value">${load.date}</div>
            </div>
            ${load.driver && load.status !== 'Booked' ? `
            <div class="item">
              <div class="label">Assigned</div>
              <div class="value">Driver: ${load.driver}</div>
            </div>
            ` : ''}
            ${load.pickupDate && !['Booked', 'Assigned'].includes(load.status) ? `
            <div class="item">
              <div class="label">Picked Up</div>
              <div class="value">${load.pickupDate}</div>
            </div>
            ` : ''}
            ${load.deliveryDate && load.status === 'Delivered' ? `
            <div class="item">
              <div class="label">Delivered</div>
              <div class="value">${load.deliveryDate}</div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} by Octopus TMS</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print PDF
            </button>
          </div>
        </body>
        </html>
      `);

      newWindow.document.close();

      // Simulate a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      notify('Load details exported to PDF successfully');
    } catch (error) {
      notify('Error exporting to PDF. Please try again.', 'error');
    } finally {
      setExportingPdf(false);
    }
  };

  // Handle document download
  const handleDocumentDownload = async (doc: Document) => {
    if (downloadingDoc === doc.id) return;
    setDownloadingDoc(doc.id);

    try {
      // For Proof of Delivery, generate it dynamically
      if (doc.name === 'Proof of Delivery') {
        await generatePOD();
        return;
      }

      // For other documents, download from the provided path
      if (!doc.path) {
        notify('Document not available', 'error');
        return;
      }

      // In a real app, this would be a fetch request to the backend
      // For this implementation, we'll simulate a download
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create a link to download the file
      const link = document.createElement('a');
      link.href = doc.path;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify(`${doc.name} downloaded successfully`);
    } catch (error) {
      notify(`Error downloading ${doc.name}. Please try again.`, 'error');
    } finally {
      setDownloadingDoc(null);
    }
  };

  // Generate Proof of Delivery document
  const generatePOD = async () => {
    if (!load) return;

    try {
      // Create a new window for the POD
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        notify('Please allow pop-ups to generate POD', 'error');
        return;
      }

      // Create the POD document
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Proof of Delivery - ${load.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; color: #2563eb; }
            .section { margin-bottom: 20px; }
            .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .item { margin-bottom: 10px; }
            .label { font-weight: bold; color: #666; }
            .value { }
            .signature-box { border: 1px solid #ddd; padding: 20px; margin-top: 10px; height: 100px; display: flex; align-items: center; justify-content: center; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Proof of Delivery</h1>
            <p>Load ID: ${load.id}</p>
          </div>

          <div class="section">
            <h2>Basic Information</h2>
            <div class="grid">
              <div>
                <div class="item">
                  <div class="label">Recipient's Name</div>
                  <div class="value">John Smith</div>
                </div>
                <div class="item">
                  <div class="label">Recipient's Address</div>
                  <div class="value">${load.destination}</div>
                </div>
              </div>
              <div>
                <div class="item">
                  <div class="label">Order Details</div>
                  <div class="value">Order #${load.id.substring(2)}</div>
                  <div class="value">Item: ${load.equipment} - ${load.weight}</div>
                </div>
                <div class="item">
                  <div class="label">Tracking Number</div>
                  <div class="value">TRK-${load.id}-${new Date().getFullYear()}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Delivery Confirmation</h2>
            <div class="grid">
              <div>
                <div class="item">
                  <div class="label">Recipient's Signature</div>
                  <div class="signature-box">
                    <p style="color: #999;">Signature on File</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="item">
                  <div class="label">Date and Time of Delivery</div>
                  <div class="value">${load.deliveryDate || new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="item">
                  <div class="label">Delivery Address</div>
                  <div class="value">${load.destination}</div>
                </div>
                <div class="item">
                  <div class="label">GPS Coordinates</div>
                  <div class="value">40.7128° N, 74.0060° W</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Additional Information</h2>
            <div class="grid">
              <div>
                <div class="item">
                  <div class="label">Condition of Goods</div>
                  <div class="value">Good condition, no damage reported</div>
                </div>
                <div class="item">
                  <div class="label">Special Instructions</div>
                  <div class="value">${load.notes || 'None'}</div>
                </div>
              </div>
              <div>
                <div class="item">
                  <div class="label">Driver's Name</div>
                  <div class="value">${load.driver || 'Not assigned'}</div>
                </div>
                <div class="item">
                  <div class="label">Vehicle Information</div>
                  <div class="value">Truck #T-2025-${load.id.substring(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This electronic Proof of Delivery (ePOD) was generated on ${new Date().toLocaleString()} by Octopus TMS</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print POD
            </button>
          </div>
        </body>
        </html>
      `);

      newWindow.document.close();

      // Simulate a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      notify('Proof of Delivery generated successfully');
    } catch (error) {
      notify('Error generating Proof of Delivery. Please try again.', 'error');
    } finally {
      setDownloadingDoc(null);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked': return 'bg-gray-600 text-white';
      case 'Posted': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-green-100 text-green-800';
      case 'En Route': return 'bg-yellow-100 text-yellow-800';
      case 'Picked Up': return 'bg-yellow-500 text-white';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      case 'Awaiting Docs': return 'bg-orange-100 text-orange-800';
      case 'Paid': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Handle back button
  const handleBack = () => {
    // Navigate back to broker loads if coming from broker module
    if (location.state?.load) {
      navigate('/broker/loads');
    } else {
      navigate('/all-loads');
    }
  };

  // Handle document preview
  const handleDocumentPreview = (doc: Document) => {
    if (doc.name === 'Proof of Delivery' && !doc.path) {
      generatePOD();
      return;
    }

    if (!doc.path) {
      notify('Document preview not available', 'error');
      return;
    }

    // Open document in a modal or new window
    setPreviewingDoc(doc.id);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = () => {
      document.body.removeChild(modal);
      setPreviewingDoc(null);
    };

    const content = document.createElement('div');
    content.className = 'bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden';
    content.onclick = (e) => e.stopPropagation();

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center p-4 border-b';
    header.innerHTML = `
      <h3 class="text-lg font-semibold">${doc.name}</h3>
      <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    const body = document.createElement('div');
    body.className = 'p-4 overflow-auto';
    body.style.maxHeight = 'calc(90vh - 120px)';

    if (doc.type === 'Image') {
      const img = document.createElement('img');
      img.src = doc.path;
      img.className = 'w-full h-auto';
      img.alt = doc.name;
      body.appendChild(img);
    } else {
      body.innerHTML = '<p class="text-center text-gray-500">PDF preview would be displayed here</p>';
    }

    content.appendChild(header);
    content.appendChild(body);
    modal.appendChild(content);
    document.body.appendChild(modal);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!load) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <i className="fas fa-exclamation-triangle text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Load not found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            The load you are looking for does not exist or has been removed.
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleBack}
          >
            Back to All Loads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            className="mr-4 text-blue-600 hover:text-blue-800"
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Load Details: {load.id}</h1>
            <p className="text-gray-600">{load.origin} → {load.destination}</p>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-primary flex items-center"
            onClick={exportToPdf}
            disabled={exportingPdf}
          >
            {exportingPdf ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf mr-2"></i>
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Load Information</h2>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(load.status)}`}>
                  {load.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Shipment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">Load ID</span>
                      <span className="font-medium">{load.id}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Customer</span>
                      <span className="font-medium">{load.customer}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Broker</span>
                      <span className="font-medium">{load.broker}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Equipment</span>
                      <span className="font-medium">{load.equipment}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Weight</span>
                      <span className="font-medium">{load.weight}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Route Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">Origin</span>
                      <span className="font-medium">{load.origin}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Destination</span>
                      <span className="font-medium">{load.destination}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Distance</span>
                      <span className="font-medium">{load.miles} miles</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Date</span>
                      <span className="font-medium">{load.date}</span>
                    </div>
                    {load.eta && (
                      <div>
                        <span className="text-sm text-gray-500 block">ETA</span>
                        <span className="font-medium">{load.eta}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Financial Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Rate</span>
                    <span className="text-xl font-semibold text-green-600">${load.price.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Rate per Mile</span>
                    <span className="text-xl font-semibold text-green-600">
                      ${load.miles ? (load.price / load.miles).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Payment Status</span>
                    <span className="text-xl font-semibold">
                      {load.status === 'Delivered' ? 'Ready for Invoice' : 'Pending Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {load.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Notes</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm text-gray-700">{load.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Status Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10 mr-4">
                      <i className="fas fa-clipboard-check text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{load.status === 'Posted' ? 'Posted' : 'Booked'}</h3>
                      <p className="text-sm text-gray-500">{new Date(load.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className={`relative flex items-start ${['Posted', 'Booked'].includes(load.status) ? 'opacity-50' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${!['Posted', 'Booked'].includes(load.status) ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center z-10 mr-4`}>
                      <i className={`fas fa-user-check ${!['Posted', 'Booked'].includes(load.status) ? 'text-green-600' : 'text-gray-400'}`}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Assigned</h3>
                      {load.driver && !['Posted', 'Booked'].includes(load.status) ? (
                        <>
                          <p className="text-sm text-gray-500">Carrier: {load.broker}</p>
                          <p className="text-sm text-gray-500">Driver: {load.driver}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className={`relative flex items-start ${['Posted', 'Booked', 'Assigned'].includes(load.status) ? 'opacity-50' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${['En Route', 'Picked Up', 'Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? 'bg-yellow-100' : 'bg-gray-100'} flex items-center justify-center z-10 mr-4`}>
                      <i className={`fas fa-truck ${['En Route', 'Picked Up', 'Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? 'text-yellow-600' : 'text-gray-400'}`}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{load.status === 'En Route' ? 'En Route' : 'Picked Up'}</h3>
                      {load.pickupDate && !['Posted', 'Booked', 'Assigned'].includes(load.status) ? (
                        <>
                          <p className="text-sm text-gray-500">{new Date(load.pickupDate).toLocaleDateString()}</p>
                          {load.eta && <p className="text-sm text-gray-500">ETA: {load.eta}</p>}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className={`relative flex items-start ${!['Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? 'opacity-50' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${['Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center z-10 mr-4`}>
                      <i className={`fas fa-check-circle ${['Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? 'text-purple-600' : 'text-gray-400'}`}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Delivered</h3>
                      {load.deliveryDate && ['Delivered', 'Awaiting Docs', 'Paid'].includes(load.status) ? (
                        <p className="text-sm text-gray-500">{new Date(load.deliveryDate).toLocaleDateString()}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  </div>

                  {['Awaiting Docs', 'Paid'].includes(load.status) && (
                    <div className="relative flex items-start">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${load.status === 'Paid' ? 'bg-gray-100' : 'bg-orange-100'} flex items-center justify-center z-10 mr-4`}>
                        <i className={`fas ${load.status === 'Paid' ? 'fa-dollar-sign text-gray-600' : 'fa-file-alt text-orange-600'}`}></i>
                      </div>
                      <div>
                        <h3 className="text-base font-medium">{load.status}</h3>
                        <p className="text-sm text-gray-500">{load.status === 'Paid' ? 'Payment processed' : 'Waiting for documents'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {load.documents && load.documents.length > 0 && (
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Documents</h2>
                <div className="space-y-4">
                  {load.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <i className={`fas ${doc.type === 'PDF' ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'} text-lg`}></i>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.uploadDate} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() => handleDocumentPreview(doc)}
                          disabled={previewingDoc !== null}
                          title="Preview"
                        >
                          {previewingDoc === doc.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-gray-600 rounded-full border-t-transparent"></div>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleDocumentDownload(doc)}
                          disabled={downloadingDoc !== null}
                          title="Download"
                        >
                          {downloadingDoc === doc.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                          ) : (
                            <i className="fas fa-download"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadDetails;
