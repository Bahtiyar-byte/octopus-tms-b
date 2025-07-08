// Mock company profile data for shippers
export const mockCompanyProfiles = {
  shipper1: {
    companyName: 'Shanahan Transportation Systems, Inc.',
    companyType: 'Shipper',
    contact: {
      name: 'Tom Shanahan',
      email: 'tom.shanahan@shanahan-transport.com',
      phone: '(555) 777-8888',
      title: 'Logistics Director'
    },
    address: {
      street: '123 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    settings: {
      defaultEquipmentType: 'Flatbed',
      preferredCarriers: ['Shanahan Transportation', 'Swift Logistics', 'JB Hunt'],
      paymentTerms: 'Net 30',
      documentRequirements: ['BOL', 'POD', 'Rate Confirmation'],
      insuranceMinimum: 1000000
    }
  },
  shipper2: {
    companyName: 'Jupiter Aluminum Corporation',
    companyType: 'Shipper',
    contact: {
      name: 'Lisa Chen',
      email: 'lisa.chen@jupiter-aluminum.com',
      phone: '(555) 999-0000',
      title: 'Supply Chain Manager'
    },
    address: {
      street: '456 Manufacturing Way',
      city: 'Detroit',
      state: 'MI',
      zip: '48201',
      country: 'USA'
    },
    settings: {
      defaultEquipmentType: 'Flatbed',
      preferredCarriers: ['Werner Enterprises', 'Schneider National', 'Swift Logistics'],
      paymentTerms: 'Net 45',
      documentRequirements: ['BOL', 'POD', 'Rate Confirmation', 'Weight Ticket'],
      insuranceMinimum: 2000000
    }
  },
  shipper3: {
    companyName: 'Midwest Logistics Solutions',
    companyType: 'Shipper',
    contact: {
      name: 'Mark Thompson',
      email: 'mark.thompson@midwest-logistics.com',
      phone: '(555) 222-3333',
      title: 'Operations Manager'
    },
    address: {
      street: '789 Distribution Center Dr',
      city: 'Milwaukee',
      state: 'WI',
      zip: '53201',
      country: 'USA'
    },
    settings: {
      defaultEquipmentType: 'Dry Van',
      preferredCarriers: ['JB Hunt', 'Shanahan Transportation', 'Regional Transport Services'],
      paymentTerms: 'Net 15',
      documentRequirements: ['BOL', 'POD', 'Invoice'],
      insuranceMinimum: 1500000
    }
  }
};