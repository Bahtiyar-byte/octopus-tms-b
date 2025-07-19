import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import DocumentViewer from '../../../components/DocumentViewer';
import { mockActions, notify } from '../../../services';
import { getSamplePdfUrlById } from '../../../services/documentService';

interface Document {
  id: string;
  name: string;
  type: 'rate_confirmation' | 'bol' | 'pod' | 'invoice' | 'other';
  date: string;
  size: string;
  previewUrl?: string;
}

const Documents: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const documentsList: Record<string, Document[]> = {
    rate_confirmations: [
      { id: '1', name: 'LD1001_Rate_Conf.pdf', type: 'rate_confirmation', date: '5/21/2025', size: '156 KB' },
      { id: '2', name: 'LD1002_Rate_Conf.pdf', type: 'rate_confirmation', date: '5/20/2025', size: '145 KB' },
      { id: '3', name: 'LD1003_Rate_Conf.pdf', type: 'rate_confirmation', date: '5/19/2025', size: '162 KB' },
      { id: '4', name: 'LD1004_Rate_Conf.pdf', type: 'rate_confirmation', date: '5/18/2025', size: '154 KB' },
      { id: '5', name: 'LD1005_Rate_Conf.pdf', type: 'rate_confirmation', date: '5/17/2025', size: '149 KB' }
    ],
    bills_of_lading: [
      { id: '6', name: 'LD1001_BOL.pdf', type: 'bol', date: '5/22/2025', size: '210 KB' },
      { id: '7', name: 'LD1002_BOL.pdf', type: 'bol', date: '5/21/2025', size: '195 KB' },
      { id: '8', name: 'LD1003_BOL.pdf', type: 'bol', date: '5/20/2025', size: '220 KB' }
    ],
    proofs_of_delivery: [
      { id: '9', name: 'LD1001_POD.pdf', type: 'pod', date: '5/23/2025', size: '176 KB' },
      { id: '10', name: 'LD1002_POD.pdf', type: 'pod', date: '5/22/2025', size: '185 KB' },
      { id: '11', name: 'LD1003_POD.pdf', type: 'pod', date: '5/21/2025', size: '190 KB' }
    ]
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  const handleDownloadDocument = async (document: Document) => {
    setLoading(true);
    try {
      await mockActions.downloadDocument(document.id);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleShareDocument = (document: Document) => {
    setDocumentToShare(document);
    setShowShareModal(true);
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete ${document.name}?`)) return;

    setLoading(true);
    try {
      await notify(`Document ${document.name} deleted successfully`);

      // Update the local state (this would be an API call in a real app)
      const typeKey = document.type === 'rate_confirmation' ? 'rate_confirmations' :
                     document.type === 'bol' ? 'bills_of_lading' : 'proofs_of_delivery';

      const typeList = [...documentsList[typeKey]];
      const updatedList = typeList.filter(doc => doc.id !== document.id);
      documentsList[typeKey] = updatedList;

      if (selectedDocument?.id === document.id) {
        setSelectedDocument(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    setLoading(true);
    try {
      // In a real app, we would upload the file to the server
      await notify('Document uploaded successfully');
      setShowUploadModal(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleShareSubmit = async () => {
    if (!documentToShare || !shareEmail.trim()) return;

    setLoading(true);
    try {
      await notify(`Document shared with ${shareEmail}`);
      setShowShareModal(false);
      setShareEmail('');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePrintDocument = async (document: Document) => {
    setLoading(true);
    try {
      await notify(`Printing ${document.name}`);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Quick Actions Handlers
  const handleRecentlyUploaded = async () => {
    setLoading(true);
    try {
      await notify('Viewing recently uploaded documents');
      setSelectedType('all');
      // In a real app, we would fetch the recently uploaded documents
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleStarredDocuments = async () => {
    setLoading(true);
    try {
      await notify('Viewing starred documents');
      setSelectedType('all');
      // In a real app, we would fetch the starred documents
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSharedWithMe = async () => {
    setLoading(true);
    try {
      await notify('Viewing documents shared with you');
      setSelectedType('all');
      // In a real app, we would fetch the shared documents
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = () => {
    const allDocs = Object.values(documentsList).flat();

    return allDocs.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || doc.type === selectedType;

      return matchesSearch && matchesType;
    });
  };

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'rate_confirmation': 'Rate Confirmation',
      'bol': 'Bill of Lading',
      'pod': 'Proof of Delivery',
      'invoice': 'Invoice',
      'other': 'Other'
    };

    return labels[type] || type;
  };

  const getDocTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'rate_confirmation': 'fa-file-contract',
      'bol': 'fa-file-invoice',
      'pod': 'fa-clipboard-check',
      'invoice': 'fa-file-invoice-dollar',
      'other': 'fa-file'
    };

    return icons[type] || 'fa-file';
  };

  const getDocTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'rate_confirmation': 'blue',
      'bol': 'green',
      'pod': 'purple',
      'invoice': 'orange',
      'other': 'gray'
    };

    return colors[type] || 'gray';
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage and organize your transportation documents</p>
        </div>
        <div>
          <button
            className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setShowUploadModal(true)}
            disabled={loading}
          >
            <i className="fas fa-cloud-upload-alt mr-2"></i>
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="mb-4">
              <label htmlFor="document-search" className="sr-only">Search documents</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  id="document-search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search documents"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Document Types</h3>
              <div className="space-y-2">
                <div
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedType === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedType('all')}
                >
                  <div className="flex items-center">
                    <i className="fas fa-folder text-blue-500 mr-2"></i>
                    <span className="font-medium">All Documents</span>
                    <span className="ml-auto bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      {Object.values(documentsList).flat().length}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedType === 'rate_confirmation' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedType('rate_confirmation')}
                >
                  <div className="flex items-center">
                    <i className="fas fa-file-contract text-blue-500 mr-2"></i>
                    <span className="font-medium">Rate Confirmations</span>
                    <span className="ml-auto bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      {documentsList.rate_confirmations.length}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedType === 'bol' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedType('bol')}
                >
                  <div className="flex items-center">
                    <i className="fas fa-file-invoice text-green-500 mr-2"></i>
                    <span className="font-medium">Bills of Lading</span>
                    <span className="ml-auto bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      {documentsList.bills_of_lading.length}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedType === 'pod' ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedType('pod')}
                >
                  <div className="flex items-center">
                    <i className="fas fa-clipboard-check text-purple-500 mr-2"></i>
                    <span className="font-medium">Proof of Delivery</span>
                    <span className="ml-auto bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      {documentsList.proofs_of_delivery.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Access</h3>
              <div className="space-y-2">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center"
                  onClick={handleRecentlyUploaded}
                  disabled={loading}
                >
                  <i className="fas fa-clock text-gray-400 mr-2"></i>
                  <span className="text-gray-700">Recently Uploaded</span>
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center"
                  onClick={handleStarredDocuments}
                  disabled={loading}
                >
                  <i className="fas fa-star text-gray-400 mr-2"></i>
                  <span className="text-gray-700">Starred Documents</span>
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center"
                  onClick={handleSharedWithMe}
                  disabled={loading}
                >
                  <i className="fas fa-share-alt text-gray-400 mr-2"></i>
                  <span className="text-gray-700">Shared with Me</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 shrink-0">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Storage usage</h4>
                <p className="text-sm text-blue-600 mb-2">4.2 GB of 10 GB used</p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="shadow-sm mb-6">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-medium">
                {filteredDocuments().length} Document{filteredDocuments().length !== 1 ? 's' : ''}
                {selectedType !== 'all' && ` • ${getDocTypeLabel(selectedType)}`}
                {searchQuery && ` • "${searchQuery}"`}
              </h3>
            </div>

            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments().map((doc) => {
                      const isSelected = selectedDocument?.id === doc.id;
                      const docColor = getDocTypeColor(doc.type);
                      const docIcon = getDocTypeIcon(doc.type);

                      return (
                        <tr
                          key={doc.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                          onClick={() => handleDocumentSelect(doc)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-lg bg-${docColor}-100 flex items-center justify-center text-${docColor}-600`}>
                                <i className={`fas ${docIcon}`}></i>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                <div className="text-sm text-gray-500">
                                  {doc.name.split('_')[0]} • {doc.type === 'bol' ? 'Bill of Lading' : doc.type === 'pod' ? 'Proof of Delivery' : 'Rate Confirmation'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${docColor}-100 text-${docColor}-800`}>
                              {getDocTypeLabel(doc.type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(doc);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}
                              >
                                <i className="fas fa-download"></i>
                              </button>
                              <button
                                className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareDocument(doc);
                                }}
                              >
                                <i className="fas fa-share"></i>
                              </button>
                              <button
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(doc);
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-medium">Document Preview</h3>
            </div>

            {selectedDocument ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-lg bg-${getDocTypeColor(selectedDocument.type)}-100 flex items-center justify-center text-${getDocTypeColor(selectedDocument.type)}-600 mr-3`}>
                      <i className={`fas ${getDocTypeIcon(selectedDocument.type)}`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedDocument.name}</h4>
                      <p className="text-sm text-gray-500">
                        {getDocTypeLabel(selectedDocument.type)} • Uploaded on {selectedDocument.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                      onClick={() => handleDownloadDocument(selectedDocument)}
                      disabled={loading}
                    >
                      <i className="fas fa-download mr-1"></i>
                      <span>Download</span>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => handlePrintDocument(selectedDocument)}
                      disabled={loading}
                    >
                      <i className="fas fa-print mr-1"></i>
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <DocumentViewer
                    file={getSamplePdfUrlById(selectedDocument.id)}
                    className="h-full"
                  />
                  <div className="absolute bottom-4 right-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                      onClick={() => handleViewDocument(selectedDocument)}
                    >
                      View Full Document
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Related Documents</h4>
                    <div className="space-y-2">
                      <div
                        className="bg-gray-50 rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          const relatedDoc = documentsList.bills_of_lading.find(doc => doc.name.includes(selectedDocument.name.split('_')[0]));
                          if (relatedDoc) {
                            handleDocumentSelect(relatedDoc);
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-3">
                          <i className="fas fa-file-invoice"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">LD1001_BOL.pdf</div>
                          <div className="text-xs text-gray-500">Bill of Lading</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>

                      <div
                        className="bg-gray-50 rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          const relatedDoc = documentsList.proofs_of_delivery.find(doc => doc.name.includes(selectedDocument.name.split('_')[0]));
                          if (relatedDoc) {
                            handleDocumentSelect(relatedDoc);
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                          <i className="fas fa-clipboard-check"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">LD1001_POD.pdf</div>
                          <div className="text-xs text-gray-500">Proof of Delivery</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Document History</h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Document uploaded</div>
                          <div className="text-xs text-gray-500">May 21, 2025 at 2:34 PM</div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                          <i className="fas fa-eye"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Viewed by John Doe</div>
                          <div className="text-xs text-gray-500">May 22, 2025 at 10:15 AM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <i className="fas fa-file-alt text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No document selected</h3>
                <p className="max-w-sm">Click on a document in the list above to preview it here.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowUploadModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleUploadDocument}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select className="block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="rate_confirmation">Rate Confirmation</option>
              <option value="bol">Bill of Lading</option>
              <option value="pod">Proof of Delivery</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Load</label>
            <select className="block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="">Select a load</option>
              <option value="LD1001">LD1001</option>
              <option value="LD1002">LD1002</option>
              <option value="LD1003">LD1003</option>
              <option value="LD1004">LD1004</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              rows={3}
              placeholder="Add a description to help identify this document"
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Share Document Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Document"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowShareModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleShareSubmit}
              disabled={loading || !shareEmail.trim()}
            >
              {loading ? 'Sharing...' : 'Share Document'}
            </button>
          </div>
        }
      >
        {documentToShare && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center">
              <div className={`h-10 w-10 rounded-lg bg-${getDocTypeColor(documentToShare.type)}-100 flex items-center justify-center text-${getDocTypeColor(documentToShare.type)}-600 mr-3`}>
                <i className={`fas ${getDocTypeIcon(documentToShare.type)}`}></i>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{documentToShare.name}</h4>
                <p className="text-sm text-gray-500">
                  {getDocTypeLabel(documentToShare.type)} • {documentToShare.size}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="block w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                className="block w-full border border-gray-300 rounded-md py-2 px-3"
                rows={3}
                placeholder="Add a message to the recipient"
              ></textarea>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div className="text-sm text-blue-800">
                  <p>The recipient will receive an email with a link to view or download this document.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Document View Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={selectedDocument?.name || "Document Viewer"}
        size="xl"
        footer={
          <div className="flex justify-between w-full">
            <div>
              <button
                className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => {
                  if (selectedDocument) {
                    handleDownloadDocument(selectedDocument);
                  }
                }}
                disabled={loading}
              >
                <i className="fas fa-download mr-1.5"></i>
                Download
              </button>
            </div>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowDocumentModal(false)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedDocument && (
          <div className="h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
            <div className="flex h-full">
              {/* Document viewer */}
              <div className="flex-1">
                <DocumentViewer
                  file={getSamplePdfUrlById(selectedDocument.id)}
                  className="h-full"
                />
              </div>

              {/* Document info sidebar */}
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-lg bg-${getDocTypeColor(selectedDocument.type)}-100 flex items-center justify-center text-${getDocTypeColor(selectedDocument.type)}-600 mr-3`}>
                      <i className={`fas ${getDocTypeIcon(selectedDocument.type)}`}></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedDocument.name}</h3>
                      <p className="text-sm text-gray-500">
                        {getDocTypeLabel(selectedDocument.type)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Document Details</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Load ID</p>
                      <p className="text-sm font-medium">{selectedDocument.name.split('_')[0]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{selectedDocument.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm font-medium">{selectedDocument.size}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => handlePrintDocument(selectedDocument)}
                    >
                      <i className="fas fa-print mr-2"></i>
                      Print Document
                    </button>
                    <button
                      className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => {
                        setShowDocumentModal(false);
                        handleShareDocument(selectedDocument);
                      }}
                    >
                      <i className="fas fa-share-alt mr-2"></i>
                      Share Document
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Document History</h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shrink-0">
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Document uploaded</div>
                        <div className="text-xs text-gray-500">May 21, 2025 at 2:34 PM</div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 shrink-0">
                        <i className="fas fa-eye"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Viewed by John Doe</div>
                        <div className="text-xs text-gray-500">May 22, 2025 at 10:15 AM</div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 shrink-0">
                        <i className="fas fa-download"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Downloaded by Sarah Johnson</div>
                        <div className="text-xs text-gray-500">May 22, 2025 at 3:45 PM</div>
                      </div>
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

export default Documents;
