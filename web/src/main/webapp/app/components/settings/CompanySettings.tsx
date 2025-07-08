import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CompanyInfo } from '../../types/settings';

interface CompanySettingsProps {
  initialCompanyInfo: CompanyInfo;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ initialCompanyInfo }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('company-', '');
    setCompanyInfo({
      ...companyInfo,
      [fieldName]: value
    });
  };

  const handleSaveCompanyInfo = () => {
    toast.success('Company information saved successfully');
  };

  const handleCancelCompanyEdit = () => {
    setCompanyInfo(initialCompanyInfo);
    toast.error('Changes discarded');
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your company details and information</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company-name" className="form-label">
              Company Name
            </label>
            <input 
              type="text" 
              id="company-name" 
              className="form-control text-sm"
              value={companyInfo.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="company-mcNumber" className="form-label">
              MC Number
            </label>
            <input 
              type="text" 
              id="company-mcNumber" 
              className="form-control text-sm"
              value={companyInfo.mcNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company-dotNumber" className="form-label">
              DOT Number
            </label>
            <input 
              type="text" 
              id="company-dotNumber" 
              className="form-control text-sm"
              value={companyInfo.dotNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="company-ein" className="form-label">
              EIN
            </label>
            <input 
              type="text" 
              id="company-ein" 
              className="form-control text-sm"
              value={companyInfo.ein}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company-address" className="form-label">
            Address
          </label>
          <input 
            type="text" 
            id="company-address" 
            className="form-control text-sm"
            value={companyInfo.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="company-city" className="form-label">
              City
            </label>
            <input 
              type="text" 
              id="company-city" 
              className="form-control text-sm"
              value={companyInfo.city}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="company-state" className="form-label">
              State
            </label>
            <input 
              type="text" 
              id="company-state" 
              className="form-control text-sm"
              value={companyInfo.state}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="company-zip" className="form-label">
              ZIP Code
            </label>
            <input 
              type="text" 
              id="company-zip" 
              className="form-control text-sm"
              value={companyInfo.zip}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company-phone" className="form-label">
              Phone
            </label>
            <input 
              type="text" 
              id="company-phone" 
              className="form-control text-sm"
              value={companyInfo.phone}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="company-email" className="form-label">
              Email
            </label>
            <input 
              type="email" 
              id="company-email" 
              className="form-control text-sm"
              value={companyInfo.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            className="btn btn-white"
            onClick={handleCancelCompanyEdit}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSaveCompanyInfo}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;