import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { isValidEmail, isRequired, sanitizeInput } from '../../utils/validation';

interface CustomerOutreachFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
}

export const CustomerOutreachForm: React.FC<CustomerOutreachFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Validate required fields
    if (!isRequired(name) || !isRequired(email) || !isRequired(subject) || !isRequired(message)) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    onSubmit({
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    });

    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    toast.success('Outreach message sent successfully!');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@company.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message to the customer..."
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Professional Communication
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              This message will be sent from the company email with your supervisor signature.
            </p>
          </div>
        </div>
      </div>
      
      {/* Hidden submit button for form submission */}
      <button
        id="customer-outreach-form"
        type="button"
        onClick={handleSubmit}
        style={{ display: 'none' }}
      />
    </div>
  );
};