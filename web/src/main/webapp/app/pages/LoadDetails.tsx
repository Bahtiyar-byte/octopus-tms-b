import React, { useState, useEffect, useCallback } from 'react';
import { pdf, Document as PdfDoc, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components';
import { notify } from '../services';
import { ApiClient } from '../services/api/client';
import { Load, LoadDocument, LoadStatus, EquipmentType, LoadDetailsData } from '../types/core/load.types';
import { ApiError } from '../types/core/error.types';

// Document interface for LoadDetails
interface LoadDetailsDocument extends LoadDocument {
  status?: 'pending' | 'uploaded' | 'verified' | 'rejected';
  size?: number;
  mimeType?: string;
  downloadUrl?: string;
}

// Error state interface
interface LoadDetailsErrorState {
  hasError: boolean;
  error?: ApiError;
}

const LoadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [load, setLoad] = useState<LoadDetailsData | null>(null);
  const [documents, setDocuments] = useState<LoadDetailsDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<LoadDetailsErrorState>({ hasError: false });
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // PDF styles
  const pdfStyles = StyleSheet.create({
    page: { padding: 24, fontSize: 11, color: '#111827' },
    header: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
    subHeader: { fontSize: 12, color: '#6B7280', marginBottom: 12 },
    section: { marginBottom: 14 },
    row: { display: 'flex', flexDirection: 'row', marginBottom: 6 },
    col: { flex: 1 },
    label: { fontSize: 9, color: '#6B7280' },
    value: { fontSize: 11, fontWeight: 600 },
    chip: {
      fontSize: 10,
      color: '#111827',
      backgroundColor: '#F3F4F6',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      alignSelf: 'flex-start'
    },
    hr: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
    small: { fontSize: 9, color: '#374151' }
  });

  const formatCurrency = (v?: string | number): string => {
    if (v === undefined || v === null) return 'N/A';
    const num = typeof v === 'string' ? Number(v) : v;
    if (Number.isNaN(num)) return 'N/A';
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatDate = (d?: string): string => (d ? new Date(d).toLocaleDateString() : 'N/A');

  const formatDateTime = (d?: string): string => (d ? new Date(d).toLocaleString() : 'N/A');

  const LoadDetailsPDF: React.FC<{ load: LoadDetailsData; documents: LoadDetailsDocument[] }> = ({ load, documents }) => (
    <PdfDoc>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Load Details: {load.loadNumber}</Text>
        <Text style={pdfStyles.subHeader}>
          {load.origin} → {load.destination}
        </Text>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.chip}>{(load.status || '').toString().replace('_', ' ').toUpperCase()}</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={{ ...pdfStyles.value, marginBottom: 6 }}>Shipment Details</Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Customer</Text>
              <Text style={pdfStyles.value}>{load.customer?.name || 'N/A'}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Commodity</Text>
              <Text style={pdfStyles.value}>{load.commodity}</Text>
            </View>
          </View>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Equipment</Text>
              <Text style={pdfStyles.value}>{String(load.equipmentType)}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Weight</Text>
              <Text style={pdfStyles.value}>{(load.weight || 0).toLocaleString()} lbs</Text>
            </View>
          </View>
          {load.referenceNumber && (
            <View style={pdfStyles.row}>
              <View style={pdfStyles.col}>
                <Text style={pdfStyles.label}>Reference Number</Text>
                <Text style={pdfStyles.value}>{load.referenceNumber}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={pdfStyles.section}>
          <Text style={{ ...pdfStyles.value, marginBottom: 6 }}>Route Information</Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Origin</Text>
              <Text style={pdfStyles.value}>{load.originAddress || load.origin}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Destination</Text>
              <Text style={pdfStyles.value}>{load.destinationAddress || load.destination}</Text>
            </View>
          </View>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Distance</Text>
              <Text style={pdfStyles.value}>{load.distance ? `${load.distance.toLocaleString()} mi` : 'N/A'}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Pickup / Delivery</Text>
              <Text style={pdfStyles.value}>{`${formatDate(load.pickupDate)} → ${formatDate(load.deliveryDate)}`}</Text>
            </View>
          </View>
          {load.eta && (
            <View style={pdfStyles.row}>
              <View style={pdfStyles.col}>
                <Text style={pdfStyles.label}>ETA</Text>
                <Text style={pdfStyles.value}>{formatDateTime(load.eta)}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={pdfStyles.section}>
          <Text style={{ ...pdfStyles.value, marginBottom: 6 }}>Financial Details</Text>
          <View style={pdfStyles.row}>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Total Rate</Text>
              <Text style={pdfStyles.value}>{formatCurrency(load.rate)}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Rate / Mile</Text>
              <Text style={pdfStyles.value}>{load.ratePerMile !== undefined ? formatCurrency(load.ratePerMile) : 'N/A'}</Text>
            </View>
            <View style={pdfStyles.col}>
              <Text style={pdfStyles.label}>Payment Status</Text>
              <Text style={pdfStyles.value}>
                {load.status === LoadStatus.PAID ? 'Paid' : load.status === LoadStatus.DELIVERED ? 'Ready for Invoice' : 'Pending Delivery'}
              </Text>
            </View>
          </View>
        </View>

        {load.notes && (
          <View style={pdfStyles.section}>
            <Text style={{ ...pdfStyles.value, marginBottom: 6 }}>Notes</Text>
            <Text style={pdfStyles.small}>{load.notes}</Text>
          </View>
        )}

        {documents && documents.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={{ ...pdfStyles.value, marginBottom: 6 }}>Documents</Text>
            {documents.map((d) => (
              <View key={d.id} style={{ marginBottom: 4 }}>
                <Text style={pdfStyles.small}>
                  • {d.name} ({d.type}) {d.uploadedAt ? `— ${new Date(d.uploadedAt).toLocaleDateString()}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={pdfStyles.hr} />
        <Text style={pdfStyles.small}>Generated by Octopus TMS • {new Date().toLocaleString()}</Text>
      </Page>
    </PdfDoc>
  );

  // Type-safe API calls
  const fetchLoadDetails = useCallback(async (loadId: string): Promise<void> => {
    setLoading(true);
    setError({ hasError: false });

    try {
      // Primary API call to get load details
      const response = await ApiClient.get<LoadDetailsData>(`/loads/${loadId}`);
      
      if (!response) {
        throw new Error('Invalid response format from server');
      }

      // Validate and set load data
      const loadData: LoadDetailsData = {
        ...response,
        loadNumber: response.loadNumber,
        commodity: response.commodity || 'General Freight',
        equipmentType: response.equipmentType || EquipmentType.DRY_VAN,
        status: response.status || LoadStatus.DRAFT,
        weight: response.weight || 0,
        rate: response.rate || '0',
        ratePerMile: response.distance && response.rate
          ? Number((Number(response.rate) / response.distance).toFixed(2))
          : undefined
      };

      setLoad(loadData);
      // setDocuments(response.documents || []);
      setRetryCount(0);
      
    } catch (err) {
      console.error('Error fetching load details:', err);
      
      const apiError: ApiError = {
        isApiError: true,
        status: (err as any)?.status || 500,
        message: (err as any)?.message || 'Failed to fetch load details',
        timestamp: new Date().toISOString()
      };

      setError({ hasError: true, error: apiError });

    } finally {
      setLoading(false);
    }
  }, []);

  // Fallback to navigation state if API fails
  const loadFromNavigationState = useCallback((): LoadDetailsData | null => {
    if (!location.state?.load) return null;

    const brokerLoad = location.state.load;
    return {
      id: brokerLoad.id,
      loadNumber: brokerLoad.loadNumber || brokerLoad.id,
      origin: brokerLoad.origin,
      destination: brokerLoad.destination,
      commodity: brokerLoad.commodity || 'General Freight',
      equipmentType: brokerLoad.equipmentType || EquipmentType.DRY_VAN,
      pickupDate: brokerLoad.pickupDate,
      deliveryDate: brokerLoad.deliveryDate,
      rate: String(parseFloat(brokerLoad.rate)) || '0',
      weight: brokerLoad.weight || 0,
      status: brokerLoad.status as LoadStatus,
      distance: brokerLoad.distance || Math.floor(Math.random() * 500) + 300,
      createdAt: brokerLoad.createdAt || new Date().toISOString(),
      updatedAt: brokerLoad.updatedAt || new Date().toISOString(),
      customer: brokerLoad.customer || { id: 'mock', name: 'Acme Corporation' },
      carrier: brokerLoad.carrier || { id: 'mock', name: 'ABC Logistics' },
      driver: brokerLoad.driver,
      notes: 'Customer requires delivery confirmation. Call ahead 2 hours before arrival.',
      ratePerMile: brokerLoad.distance ? (parseFloat(brokerLoad.rate) / brokerLoad.distance) : undefined
    };
  }, [location.state]);

  // Effect to fetch load details
  useEffect(() => {
    if (!id) {
      setError({ 
        hasError: true, 
        error: { 
          isApiError: true, 
          status: 400, 
          message: 'Load ID is required',
          timestamp: new Date().toISOString()
        } 
      });
      setLoading(false);
      return;
    }

    // Try to fetch from API first
    fetchLoadDetails(id).catch(() => {
      // If API fails, try to use navigation state as fallback
      const fallbackLoad = loadFromNavigationState();
      if (fallbackLoad) {
        setLoad(fallbackLoad);
        setError({ hasError: false });

        // Mock documents for fallback
        setDocuments([
          {
            id: 'DOC1001',
            type: 'bol',
            name: 'Bill of Lading',
            url: '/api/documents/BOL_sample.jpg',
            uploadedAt: new Date().toISOString(),
            status: 'verified',
            size: 1228800,
            mimeType: 'image/jpeg'
          },
          {
            id: 'DOC1002',
            type: 'rate_confirmation',
            name: 'Rate Confirmation',
            url: '/api/documents/rate_con.png',
            uploadedAt: new Date().toISOString(),
            status: 'verified',
            size: 838860,
            mimeType: 'image/png'
          },
          {
            id: 'DOC1003',
            type: 'pod',
            name: 'Proof of Delivery',
            url: '',
            uploadedAt: new Date().toISOString(),
            status: fallbackLoad.status === LoadStatus.DELIVERED ? 'verified' : 'pending',
            size: 2516582,
            mimeType: 'application/pdf'
          }
        ]);
      }
      setLoading(false);
    });
  }, [id, fetchLoadDetails, loadFromNavigationState]);

  // Utility functions
  const getStatusColor = (status: LoadStatus | string): string => {
    switch (status) {
      case LoadStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      case LoadStatus.POSTED: return 'bg-blue-100 text-blue-800';
      case LoadStatus.BOOKED: return 'bg-gray-600 text-white';
      case LoadStatus.ASSIGNED: return 'bg-green-100 text-green-800';
      case LoadStatus.EN_ROUTE: return 'bg-yellow-100 text-yellow-800';
      case LoadStatus.PICKED_UP: return 'bg-yellow-500 text-white';
      case LoadStatus.IN_TRANSIT: return 'bg-orange-100 text-orange-800';
      case LoadStatus.DELIVERED: return 'bg-purple-100 text-purple-800';
      case LoadStatus.AWAITING_DOCS: return 'bg-orange-100 text-orange-800';
      case LoadStatus.PAID: return 'bg-green-600 text-white';
      case LoadStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-600 text-white';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleBack = (): void => {
    if (location.state?.load) {
      navigate('/broker/loads');
    } else {
      navigate('/all-loads');
    }
  };

  const handleRetry = (): void => {
    if (id) {
      fetchLoadDetails(id);
    }
  };

  const exportToPdf = async (): Promise<void> => {
    if (!load) return;
    setExportingPdf(true);
    try {
      const blob = await pdf(<LoadDetailsPDF load={load} documents={documents} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `load-${load.loadNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('PDF exported successfully', 'success');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      notify('Error exporting PDF', 'error');
    } finally {
      setExportingPdf(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {retryCount > 0 ? `Retrying... (Attempt ${retryCount + 1})` : 'Loading load details...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error.hasError) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {error.error?.status === 404 ? 'Load not found' : 'Error loading load details'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {error.error?.message || 'An unexpected error occurred while loading the load details.'}
          </p>
          <div className="space-x-4">
            <button className="btn btn-primary" onClick={handleRetry}>
              <i className="fas fa-redo mr-2"></i>
              Retry
            </button>
            <button className="btn btn-secondary" onClick={handleBack}>
              Back to Loads
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No load state
  if (!load) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <i className="fas fa-box-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No load data available</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            Unable to load the requested load details.
          </p>
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Loads
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={handleBack}
            aria-label="Go back"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Load Details: {load.loadNumber}
            </h1>
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
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Load Information</h2>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(load.status)}`}>
                  {load.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Shipment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">Load Number</span>
                      <span className="font-medium">{load.loadNumber}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Customer</span>
                      <span className="font-medium">{load.customer?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Commodity</span>
                      <span className="font-medium">{load.commodity}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Equipment</span>
                      <span className="font-medium">{load.equipmentType}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Weight</span>
                      <span className="font-medium">{load.weight.toLocaleString()} lbs</span>
                    </div>
                    {load.referenceNumber && (
                      <div>
                        <span className="text-sm text-gray-500 block">Reference Number</span>
                        <span className="font-medium">{load.referenceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Route Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">Origin</span>
                      <span className="font-medium">{load.originAddress}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Destination</span>
                      <span className="font-medium">{load.destinationAddress}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Distance</span>
                      <span className="font-medium">{load.distance?.toLocaleString() || 'N/A'} miles</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Pickup Date</span>
                      <span className="font-medium">{new Date(load.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Delivery Date</span>
                      <span className="font-medium">{new Date(load.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    {load.eta && (
                      <div>
                        <span className="text-sm text-gray-500 block">ETA</span>
                        <span className="font-medium">{new Date(load.eta).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Financial Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Total Rate</span>
                    <span className="text-xl font-semibold text-green-600">
                      ${load.rate.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Rate per Mile</span>
                    <span className="text-xl font-semibold text-green-600">
                      ${load.ratePerMile?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block">Payment Status</span>
                    <span className="text-xl font-semibold">
                      {load.status === LoadStatus.PAID ? 'Paid' : 
                       load.status === LoadStatus.DELIVERED ? 'Ready for Invoice' : 
                       'Pending Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
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

        {/* Sidebar */}
        <div>
          {/* Status Timeline */}
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
                      <h3 className="text-base font-medium">Booked</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(load.createdAt || load.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className={`relative flex items-start ${
                    [LoadStatus.POSTED, LoadStatus.BOOKED].includes(load.status as LoadStatus) ? 'opacity-50' : ''
                  }`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                      ![LoadStatus.POSTED, LoadStatus.BOOKED].includes(load.status as LoadStatus) ? 
                      'bg-green-100' : 'bg-gray-100'
                    } flex items-center justify-center z-10 mr-4`}>
                      <i className={`fas fa-user-check ${
                        ![LoadStatus.POSTED, LoadStatus.BOOKED].includes(load.status as LoadStatus) ? 
                        'text-green-600' : 'text-gray-400'
                      }`}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Assigned</h3>
                      {load.driver && ![LoadStatus.POSTED, LoadStatus.BOOKED].includes(load.status as LoadStatus) ? (
                        <>
                          <p className="text-sm text-gray-500">Carrier: {load.carrier?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Driver: {typeof load.driver === 'string' ? load.driver : load.driver.name}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  </div>

                  <div className={`relative flex items-start ${
                    ![LoadStatus.DELIVERED, LoadStatus.AWAITING_DOCS, LoadStatus.PAID].includes(load.status as LoadStatus) ? 
                    'opacity-50' : ''
                  }`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                      [LoadStatus.DELIVERED, LoadStatus.AWAITING_DOCS, LoadStatus.PAID].includes(load.status as LoadStatus) ? 
                      'bg-purple-100' : 'bg-gray-100'
                    } flex items-center justify-center z-10 mr-4`}>
                      <i className={`fas fa-check-circle ${
                        [LoadStatus.DELIVERED, LoadStatus.AWAITING_DOCS, LoadStatus.PAID].includes(load.status as LoadStatus) ? 
                        'text-purple-600' : 'text-gray-400'
                      }`}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">Delivered</h3>
                      <p className="text-sm text-gray-500">
                        {[LoadStatus.DELIVERED, LoadStatus.AWAITING_DOCS, LoadStatus.PAID].includes(load.status as LoadStatus) ? 
                         new Date(load.deliveryDate).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents */}
          {documents && documents.length > 0 && (
            <Card className="mt-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Documents</h2>
                <div className="space-y-4">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <i className={`fas ${
                            doc.mimeType?.includes('pdf') ? 'fa-file-pdf text-red-500' : 
                            doc.mimeType?.includes('image') ? 'fa-file-image text-blue-500' : 
                            'fa-file text-gray-500'
                          } text-lg`}></i>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()} • {
                              doc.size ? formatFileSize(doc.size) : 'Unknown size'
                            }
                            {doc.status && (
                              <span className={`ml-2 px-1 py-0.5 text-xs rounded ${
                                doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                                doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {doc.status}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => notify('Document preview functionality would be implemented here', 'success')}
                          title="Preview"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => notify('Document download functionality would be implemented here', 'success')}
                          title="Download"
                        >
                          <i className="fas fa-download"></i>
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
