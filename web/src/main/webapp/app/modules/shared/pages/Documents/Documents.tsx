import React, { useState, useEffect } from 'react';
import { Card, Modal } from '../../../../components';
import DocumentViewer from '../../../../components/DocumentViewer';
import { mockActions, notify } from '../../../../services';
import { getSamplePdfUrlById, getSampleImageUrl } from '../../../../services/documentService';
import { useAuth } from '../../../../context/AuthContext';
import PageLayout from '../../layouts/PageLayout';
import { 
  getDocumentConfig, 
  getDocTypeLabel, 
  getDocTypeIcon, 
  getDocTypeColor,
  DOCUMENT_TYPES,
  CustomAction,
  DocumentCategory
} from '../../config/documentConfig';
import { CompanyType } from '../../../../types';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  previewUrl?: string;
  isImage?: boolean;
  loadId?: string;
  status?: string;
  uploadedBy?: string;
  warehouse?: string;
  expiryDate?: string;
}

export const Documents: React.FC = () => {
  const { user } = useAuth();
  const config = getDocumentConfig(user?.role || 'BROKER');
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [storageUsed, setStorageUsed] = useState(4.2); // Mock storage used

  // Mock documents list - in real app, this would come from API
  const [documentsList, setDocumentsList] = useState<Record<string, Document[]>>({
    rate_confirmations: [
      { id: '1', name: `${config.documentPrefix}1001_Rate_Conf.pdf`, type: DOCUMENT_TYPES.RATE_CONFIRMATION, date: '5/21/2025', size: '156 KB', loadId: '1001' },
      { id: '2', name: `${config.documentPrefix}1002_Rate_Conf.pdf`, type: DOCUMENT_TYPES.RATE_CONFIRMATION, date: '5/20/2025', size: '145 KB', loadId: '1002' },
      { id: '3', name: `${config.documentPrefix}1003_Rate_Conf.pdf`, type: DOCUMENT_TYPES.RATE_CONFIRMATION, date: '5/19/2025', size: '162 KB', loadId: '1003' },
      { id: '4', name: `${config.documentPrefix}1004_Rate_Conf.pdf`, type: DOCUMENT_TYPES.RATE_CONFIRMATION, date: '5/18/2025', size: '154 KB', loadId: '1004' },
      { id: '5', name: `${config.documentPrefix}1005_Rate_Conf.pdf`, type: DOCUMENT_TYPES.RATE_CONFIRMATION, date: '5/17/2025', size: '149 KB', loadId: '1005' }
    ],
    bills_of_lading: [
      { id: '6', name: `${config.documentPrefix}1001_BOL.pdf`, type: DOCUMENT_TYPES.BOL, date: '5/22/2025', size: '210 KB', loadId: '1001' },
      { id: '7', name: `${config.documentPrefix}1002_BOL.pdf`, type: DOCUMENT_TYPES.BOL, date: '5/21/2025', size: '195 KB', loadId: '1002' },
      { id: '8', name: `${config.documentPrefix}1003_BOL.pdf`, type: DOCUMENT_TYPES.BOL, date: '5/20/2025', size: '220 KB', loadId: '1003' }
    ],
    proofs_of_delivery: [
      { id: '9', name: `${config.documentPrefix}1001_POD.pdf`, type: DOCUMENT_TYPES.POD, date: '5/23/2025', size: '176 KB', loadId: '1001' },
      { id: '10', name: `${config.documentPrefix}1002_POD.pdf`, type: DOCUMENT_TYPES.POD, date: '5/22/2025', size: '185 KB', loadId: '1002' },
      { id: '11', name: `${config.documentPrefix}1003_POD.pdf`, type: DOCUMENT_TYPES.POD, date: '5/21/2025', size: '190 KB', loadId: '1003' }
    ],
    // Add role-specific documents
    ...(user?.companyType === CompanyType.BROKER ? {
      other_documents: [
        { id: '12', name: `${config.documentPrefix}1001_Lumper.jpg`, type: DOCUMENT_TYPES.LUMPER_RECEIPT, date: '5/20/2025', size: '850 KB', isImage: true, previewUrl: getSampleImageUrl(DOCUMENT_TYPES.LUMPER_RECEIPT) },
        { id: '13', name: `${config.documentPrefix}1002_Lumper.png`, type: DOCUMENT_TYPES.LUMPER_RECEIPT, date: '5/19/2025', size: '920 KB', isImage: true, previewUrl: getSampleImageUrl(DOCUMENT_TYPES.LUMPER_RECEIPT) }
      ]
    } : {}),
    ...(user?.companyType === CompanyType.SHIPPER ? {
      warehouse_certs: [
        { id: '14', name: `${config.documentPrefix}WH001_Cert.pdf`, type: DOCUMENT_TYPES.WAREHOUSE_CERT, date: '5/15/2025', size: '245 KB', warehouse: 'Chicago DC', expiryDate: '12/31/2025' },
        { id: '15', name: `${config.documentPrefix}WH002_Cert.pdf`, type: DOCUMENT_TYPES.WAREHOUSE_CERT, date: '5/10/2025', size: '280 KB', warehouse: 'Dallas Hub', expiryDate: '12/31/2025' }
      ]
    } : {})
  });

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
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handleShareDocument = (document: Document) => {
    if (!config.enableShare) return;
    setDocumentToShare(document);
    setShowShareModal(true);
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!config.enableDelete) return;
    
    if (!confirm(`Are you sure you want to delete ${document.name}?`)) return;

    setLoading(true);
    try {
      await notify(`Document ${document.name} deleted successfully`);
      
      // In real app, this would be an API call
      if (selectedDocument?.id === document.id) {
        setSelectedDocument(null);
      }
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    setLoading(true);
    try {
      await notify('Document uploaded successfully');
      setShowUploadModal(false);
    } catch (error) { /* empty */ } finally {
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
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handlePrintDocument = async (document: Document) => {
    if (!config.enablePrint) return;
    
    setLoading(true);
    try {
      await notify(`Printing ${document.name}`);
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  // Quick Actions Handlers
  const handleRecentlyUploaded = async () => {
    setLoading(true);
    try {
      await notify('Viewing recently uploaded documents');
      setSelectedType('all');
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handleStarredDocuments = async () => {
    setLoading(true);
    try {
      await notify('Viewing starred documents');
      setSelectedType('all');
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  const handleSharedWithMe = async () => {
    setLoading(true);
    try {
      await notify('Viewing documents shared with you');
      setSelectedType('all');
    } catch (error) { /* empty */ } finally {
      setLoading(false);
    }
  };

  // Execute custom actions
  const handleCustomAction = (action: CustomAction, document: Document) => {
    if (action.condition && !action.condition(document)) return;
    action.handler(document);
  };

  const filteredDocuments = () => {
    const allDocs = Object.values(documentsList).flat();

    return allDocs.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || doc.type === selectedType;

      return matchesSearch && matchesType;
    });
  };

  // Get document count by type
  const getDocumentCountByType = (type: string): number => {
    if (type === 'all') return Object.values(documentsList).flat().length;
    return Object.values(documentsList).flat().filter(doc => doc.type === type).length;
  };

  return (
    <PageLayout
      title="Documents"
      subtitle="Manage and organize your transportation documents"
      actions={config.enableUpload && (
        <button
          className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setShowUploadModal(true)}
          disabled={loading}
        >
          <i className="fas fa-cloud-upload-alt mr-2"></i>
          Upload Document
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {/* Search */}
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

            {/* Document Types */}
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
                      {getDocumentCountByType('all')}
                    </span>
                  </div>
                </div>

                {config.documentCategories.map((category: DocumentCategory) => (
                  <div
                    key={category.key}
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedType === category.key ? `bg-${category.color}-50 text-${category.color}-700` : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedType(category.key)}
                  >
                    <div className="flex items-center">
                      <i className={`fas ${category.icon} text-${category.color}-500 mr-2`}></i>
                      <span className="font-medium">{category.label}</span>
                      <span className={`ml-auto bg-${category.color}-100 text-${category.color}-700 rounded-full px-2 py-0.5 text-xs font-medium`}>
                        {getDocumentCountByType(category.key)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            {config.showQuickAccess && (
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
            )}
          </div>

          {/* Storage Indicator */}
          {config.showStorageIndicator && config.storageQuota && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 shrink-0">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Storage usage</h4>
                  <p className="text-sm text-blue-600 mb-2">
                    {storageUsed} GB of {config.storageQuota} GB used
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(storageUsed / config.storageQuota) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Documents Table */}
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
                      {user?.companyType === CompanyType.SHIPPER && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Warehouse
                        </th>
                      )}
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
                                  {doc.loadId && `Load #${doc.loadId} • `}{getDocTypeLabel(doc.type)}
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
                          {user?.companyType === CompanyType.SHIPPER && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.warehouse || '-'}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {config.enablePreview && (
                                <button
                                  className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDocument(doc);
                                  }}
                                  title="View"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              )}
                              <button
                                className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}
                                title="Download"
                              >
                                <i className="fas fa-download"></i>
                              </button>
                              {config.enableShare && (
                                <button
                                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareDocument(doc);
                                  }}
                                  title="Share"
                                >
                                  <i className="fas fa-share"></i>
                                </button>
                              )}
                              {config.enableDelete && (
                                <button
                                  className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDocument(doc);
                                  }}
                                  title="Delete"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                              {/* Custom actions */}
                              {config.customActions?.map((action: CustomAction, idx: number) => (
                                <button
                                  key={idx}
                                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCustomAction(action, doc);
                                  }}
                                  title={action.name}
                                  disabled={action.condition && !action.condition(doc)}
                                >
                                  <i className={`fas ${action.icon}`}></i>
                                </button>
                              ))}
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

          {/* Document Preview */}
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
                    {config.enablePrint && (
                      <button
                        className="btn btn-sm btn-outline-secondary flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => handlePrintDocument(selectedDocument)}
                        disabled={loading}
                      >
                        <i className="fas fa-print mr-1"></i>
                        <span>Print</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  {selectedDocument.isImage && selectedDocument.previewUrl ? (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                      <img 
                        src={selectedDocument.previewUrl} 
                        alt={selectedDocument.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <DocumentViewer
                      file={getSamplePdfUrlById(selectedDocument.id)}
                      className="h-full"
                    />
                  )}
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
                  {/* Related Documents */}
                  {config.showRelatedDocuments && selectedDocument.loadId && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Related Documents</h4>
                      <div className="space-y-2">
                        {Object.values(documentsList).flat()
                          .filter(doc => doc.loadId === selectedDocument.loadId && doc.id !== selectedDocument.id)
                          .slice(0, 2)
                          .map(relatedDoc => (
                            <div
                              key={relatedDoc.id}
                              className="bg-gray-50 rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-100"
                              onClick={() => handleDocumentSelect(relatedDoc)}
                            >
                              <div className={`h-8 w-8 rounded-lg bg-${getDocTypeColor(relatedDoc.type)}-100 flex items-center justify-center text-${getDocTypeColor(relatedDoc.type)}-600 mr-3`}>
                                <i className={`fas ${getDocTypeIcon(relatedDoc.type)}`}></i>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{relatedDoc.name}</div>
                                <div className="text-xs text-gray-500">{getDocTypeLabel(relatedDoc.type)}</div>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Document History */}
                  {config.showDocumentHistory && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Document History</h4>
                      <div className="space-y-3">
                        <div className="flex">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <i className="fas fa-cloud-upload-alt"></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Document uploaded</div>
                            <div className="text-xs text-gray-500">{selectedDocument.date} at 2:34 PM</div>
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
                  )}
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
      {config.enableUpload && (
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
                {config.documentCategories.map((category: DocumentCategory) => (
                  <option key={category.key} value={category.key}>
                    {getDocTypeLabel(category.key)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {user?.companyType === CompanyType.SHIPPER ? 'Warehouse' : 'Related Load'}
              </label>
              <select className="block w-full border border-gray-300 rounded-md py-2 px-3">
                <option value="">Select...</option>
                {user?.companyType === CompanyType.SHIPPER ? (
                  <>
                    <option value="chicago">Chicago DC</option>
                    <option value="dallas">Dallas Hub</option>
                    <option value="atlanta">Atlanta Warehouse</option>
                  </>
                ) : (
                  <>
                    <option value="1001">{config.documentPrefix}1001</option>
                    <option value="1002">{config.documentPrefix}1002</option>
                    <option value="1003">{config.documentPrefix}1003</option>
                    <option value="1004">{config.documentPrefix}1004</option>
                  </>
                )}
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
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        accept={config.allowedTypes.map((t: string) => `.${t.toLowerCase()}`).join(',')}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {config.allowedTypes.join(', ')} up to 10MB
                  </p>
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
      )}

      {/* Share Document Modal */}
      {config.enableShare && (
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
      )}

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
                {selectedDocument.isImage && selectedDocument.previewUrl ? (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <img 
                      src={selectedDocument.previewUrl} 
                      alt={selectedDocument.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <DocumentViewer
                    file={getSamplePdfUrlById(selectedDocument.id)}
                    className="h-full"
                  />
                )}
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
                    {selectedDocument.loadId && (
                      <div>
                        <p className="text-xs text-gray-500">Load ID</p>
                        <p className="text-sm font-medium">{config.documentPrefix}{selectedDocument.loadId}</p>
                      </div>
                    )}
                    {selectedDocument.warehouse && (
                      <div>
                        <p className="text-xs text-gray-500">Warehouse</p>
                        <p className="text-sm font-medium">{selectedDocument.warehouse}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{selectedDocument.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm font-medium">{selectedDocument.size}</p>
                    </div>
                    {selectedDocument.expiryDate && (
                      <div>
                        <p className="text-xs text-gray-500">Expires</p>
                        <p className="text-sm font-medium">{selectedDocument.expiryDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    {config.enablePrint && (
                      <button
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => handlePrintDocument(selectedDocument)}
                      >
                        <i className="fas fa-print mr-2"></i>
                        Print Document
                      </button>
                    )}
                    {config.enableShare && (
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
                    )}
                    {/* Custom actions */}
                    {config.customActions?.map((action: CustomAction, idx: number) => (
                      <button
                        key={idx}
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => handleCustomAction(action, selectedDocument)}
                        disabled={action.condition && !action.condition(selectedDocument)}
                      >
                        <i className={`fas ${action.icon} mr-2`}></i>
                        {action.name}
                      </button>
                    ))}
                  </div>
                </div>

                {config.showDocumentHistory && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Document History</h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shrink-0">
                          <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Document uploaded</div>
                          <div className="text-xs text-gray-500">{selectedDocument.date} at 2:34 PM</div>
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
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
};

export default Documents;