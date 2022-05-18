import { Attributes, Filter, Service } from 'onecore';
export interface LocationRate {
  locationId?: string;
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface LocationRateService extends Service<LocationRate, string, LocationRateFilter> {
  getLocationByLocationId(locationId: string): Promise<LocationRate[]>;
}

export class LocationRateFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  locationId?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
  limit?: number;
}


export const locationRateModel: Attributes = {
  id: {
    key: true,
    required: true,
    q: true
  },
  locationId: {
    required: true,
    key: true,
    q: true
  },
  userId: {
    required: true,
    q: true
  },
  rate: {
    required: true,
    q: true,
    type: 'number'
  },
  rateTime: {
    type: 'datetime'
  },
  review: {
    q: true
  }
};
