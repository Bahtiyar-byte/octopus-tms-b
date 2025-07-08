import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { toast } from 'react-hot-toast';

// Contract interface
interface Contract {
  id: string;
  carrierId: string;
  carrierName: string;
  type: 'Rate Agreement' | 'Master Agreement' | 'Insurance Certificate';
  status: 'Pending' | 'Signed' | 'Expired';
  effectiveDate: string;
  expirationDate: string;
  documentUrl: string;
  notes: string;
}

const Contracts: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Mock contracts data
  const mockContracts: Contract[] = [
    {
      id: 'C-1001',
      carrierId: 'C1001',
      carrierName: 'FastFreight Inc.',
      type: 'Master Agreement',
      status: 'Signed',
      effectiveDate: '2025-01-15',
      expirationDate: '2026-01-15',
      documentUrl: '/documents/contracts/fastfreight-master.pdf',
      notes: 'Annual master agreement with standard terms.'
    },
    {
      id: 'C-1002',
      carrierId: 'C1002',
      carrierName: 'Southwest Carriers',
      type: 'Rate Agreement',
      status: 'Signed',
      effectiveDate: '2025-03-01',
      expirationDate: '2025-09-01',
      documentUrl: '/documents/contracts/southwest-rate.pdf',
      notes: 'Specialized rates for flatbed equipment.'
    },
    {
      id: 'C-1003',
      carrierId: 'C1003',
      carrierName: 'Midwest Express',
      type: 'Insurance Certificate',
      status: 'Expired',
      effectiveDate: '2024-08-22',
      expirationDate: '2025-02-22',
      documentUrl: '/documents/contracts/midwest-insurance.pdf',
      notes: 'Needs renewal. Follow up with carrier.'
    },
    {
      id: 'C-1004',
      carrierId: 'C1004',
      carrierName: 'East Coast Logistics',
      type: 'Master Agreement',
      status: 'Signed',
      effectiveDate: '2025-02-15',
      expirationDate: '2026-02-15',
      documentUrl: '/documents/contracts/eastcoast-master.pdf',
      notes: 'Includes special provisions for Northeast deliveries.'
    },
    {
      id: 'C-1005',
      carrierId: 'C1005',
      carrierName: 'Pacific Transport',
      type: 'Rate Agreement',
      status: 'Pending',
      effectiveDate: '2025-06-01',
      expirationDate: '2025-12-01',
      documentUrl: '/documents/contracts/pacific-rate.pdf',
      notes: 'Awaiting signature from carrier.'
    },
    {
      id: 'C-1006',
      carrierId: 'C1006',
      carrierName: 'Mountain Haulers',
      type: 'Insurance Certificate',
      status: 'Signed',
      effectiveDate: '2025-03-15',
      expirationDate: '2026-03-15',
      documentUrl: '/documents/contracts/mountain-insurance.pdf',
      notes: 'Comprehensive coverage including hazardous materials.'
    }
  ];
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    carrierId: '',
    carrierName: '',
    type: 'Rate Agreement',
    effectiveDate: '',
    expirationDate: '',
    notes: ''
  });
  
  // Filter contracts based on active filter and search term
  const filteredContracts = mockContracts.filter(contract => {
    const matchesFilter = activeFilter === 'All' || contract.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      contract.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Signed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge color
  const getTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'Master Agreement':
        return 'bg-blue-100 text-blue-800';
      case 'Rate Agreement':
        return 'bg-purple-100 text-purple-800';
      case 'Insurance Certificate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value
    });
  };
  
  // Handle contract upload
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would upload the document and create a contract
    const newContract: Contract = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      carrierId: uploadForm.carrierId || `C${Math.floor(1000 + Math.random() * 9000)}`,
      carrierName: uploadForm.carrierName,
      type: uploadForm.type as any,
      status: 'Pending',
      effectiveDate: uploadForm.effectiveDate,
      expirationDate: uploadForm.expirationDate,
      documentUrl: '/documents/contracts/new-contract.pdf',
      notes: uploadForm.notes
    };
    
    toast.success(`Contract ${newContract.id} uploaded successfully!`, {
      duration: 3000,
      icon: '📄'
    });
    
    setShowUploadModal(false);
    
    // Reset form
    setUploadForm({
      carrierId: '',
      carrierName: '',
      type: 'Rate Agreement',
      effectiveDate: '',
      expirationDate: '',
      notes: ''
    });
  };
  
  // Handle contract status change
  const handleStatusChange = (contract: Contract, newStatus: 'Pending' | 'Signed' | 'Expired') => {
    // In a real app, this would update the contract status in the database
    toast.success(`Contract ${contract.id} status changed to ${newStatus}`, {
      duration: 3000
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carrier Contracts</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center"
        >
          <i className="fas fa-upload mr-2"></i> Upload Contract
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Signed', 'Pending', 'Expired'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <i className="fas fa-file-contract text-5xl mb-4"></i>
            <h3 className="text-xl font-medium mb-2">No contracts found</h3>
            <p>Try adjusting your filters or upload a new contract.</p>
          </div>
        </Card>
      ) : (
        <Card className="bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.carrierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(contract.type)}`}>
                        {contract.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contract.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contract.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {contract.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(contract, 'Signed')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Mark Signed
                        </button>
                      )}
                      {contract.status === 'Signed' && (
                        <button
                          onClick={() => handleStatusChange(contract, 'Expired')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Mark Expired
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Upload Contract Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload New Contract</h3>
              
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label htmlFor="carrierName" className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier Name *
                  </label>
                  <input
                    type="text"
                    id="carrierName"
                    name="carrierName"
                    value={uploadForm.carrierName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={uploadForm.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Rate Agreement">Rate Agreement</option>
                    <option value="Master Agreement">Master Agreement</option>
                    <option value="Insurance Certificate">Insurance Certificate</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date *
                    </label>
                    <input
                      type="date"
                      id="effectiveDate"
                      name="effectiveDate"
                      value={uploadForm.effectiveDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      id="expirationDate"
                      name="expirationDate"
                      value={uploadForm.expirationDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                    Document *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <i className="fas fa-file-upload text-gray-400 text-3xl mb-2"></i>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={uploadForm.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes about this contract..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Upload Contract
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Contract Modal */}
      {showViewModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Contract Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Contract ID:</div>
                  <div className="font-medium">{selectedContract.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Carrier:</div>
                  <div className="font-medium">{selectedContract.carrierName}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Type:</div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(selectedContract.type)}`}>
                    {selectedContract.type}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status:</div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedContract.status)}`}>
                    {selectedContract.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Effective Date:</div>
                  <div className="font-medium">{new Date(selectedContract.effectiveDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Expiration Date:</div>
                  <div className="font-medium">{new Date(selectedContract.expirationDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              {selectedContract.notes && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Notes:</div>
                  <div className="text-sm">{selectedContract.notes}</div>
                </div>
              )}
              
              <div className="mt-6 bg-gray-100 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Document:</div>
                    <div className="font-medium">contract-document.pdf</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                      <i className="fas fa-download mr-1"></i> Download
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded-md text-sm">
                      <i className="fas fa-eye mr-1"></i> Preview
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  Close
                </button>
                {selectedContract.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedContract, 'Signed');
                      setShowViewModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    Mark as Signed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;