import React from 'react';
import  Card  from '../ui/Card';
import { FieldOperation } from '../../data/operations';

interface FieldOperationsTableProps {
  fieldOperations: FieldOperation[];
  onOperationAction: (operationId: string, action: string) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalOperations?: number;
}

export const FieldOperationsTable: React.FC<FieldOperationsTableProps> = ({
  fieldOperations,
  onOperationAction,
  onPageChange,
  currentPage = 1,
  totalOperations = 24
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Requires Attention':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <section className="mb-8">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>
        Field Operations
      </h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fieldOperations.map((op, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {op.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(op.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.driver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(op.status)}`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(op.priority)}`}>
                      {op.priority.charAt(0).toUpperCase() + op.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onOperationAction(op.id, 'approve')} 
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        onClick={() => onOperationAction(op.id, 'assign')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Assign"
                      >
                        <i className="fas fa-user-plus"></i>
                      </button>
                      <button 
                        onClick={() => onOperationAction(op.id, 'details')}
                        className="text-purple-600 hover:text-purple-900"
                        title="Details"
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {onPageChange && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{fieldOperations.length}</span> of <span className="font-medium">{totalOperations}</span> operations
            </span>
            <nav className="flex space-x-2" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-blue-600 border border-blue-600'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === 3}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </Card>
    </section>
  );
};