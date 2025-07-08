export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'facility' | 'warehouse' | 'customer';
  isDefault?: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

// Jupiter Aluminum saved locations
export const jupiterAluminumLocations: SavedLocation[] = [
  {
    id: 'loc-1',
    name: 'Jupiter Aluminum - Beech Bottom',
    address: '8963 River Road, Beech Bottom, WV, 26030',
    type: 'facility',
    isDefault: true,
    coordinates: {
      lat: 40.2231,
      lon: -80.6559
    }
  },
  {
    id: 'loc-2',
    name: 'Jupiter Aluminum - Hammond',
    address: '1745 - 165th Street, Hammond, IN, 46320',
    type: 'facility',
    coordinates: {
      lat: 41.5806,
      lon: -87.5217
    }
  },
  {
    id: 'loc-3',
    name: 'Jupiter Aluminum - Fairland',
    address: '205 East Carey Street, Fairland, IN 46126',
    type: 'facility',
    coordinates: {
      lat: 39.5881,
      lon: -85.8608
    }
  },
  {
    id: 'loc-4',
    name: 'Central Warehouse - Chicago',
    address: '2500 S Ashland Ave, Chicago, IL 60608',
    type: 'warehouse',
    coordinates: {
      lat: 41.8469,
      lon: -87.6653
    }
  },
  {
    id: 'loc-5',
    name: 'Distribution Center - Detroit',
    address: '1200 Oakwood Blvd, Detroit, MI 48217',
    type: 'warehouse',
    coordinates: {
      lat: 42.3011,
      lon: -83.0787
    }
  }
];

// Additional common destinations for testing
export const commonDestinations: SavedLocation[] = [
  {
    id: 'dest-1',
    name: 'ABC Manufacturing',
    address: '456 Industrial Park Dr, Cleveland, OH 44113',
    type: 'customer',
    coordinates: {
      lat: 41.4822,
      lon: -81.6697
    }
  },
  {
    id: 'dest-2',
    name: 'XYZ Distribution',
    address: '789 Commerce Blvd, Milwaukee, WI 53204',
    type: 'customer',
    coordinates: {
      lat: 43.0116,
      lon: -87.9466
    }
  },
  {
    id: 'dest-3',
    name: 'Global Logistics Hub',
    address: '321 Freight Way, Columbus, OH 43215',
    type: 'customer',
    coordinates: {
      lat: 39.9690,
      lon: -83.0114
    }
  }
];