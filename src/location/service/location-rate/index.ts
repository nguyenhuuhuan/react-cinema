import { HttpRequest } from 'web-clients';
import { Client } from 'web-clients';
import { LocationRate, LocationRateFilter, locationRateModel, LocationRateService } from './location-rate';

export class LocationRateClient extends Client<LocationRate, string, LocationRateFilter> implements LocationRateService {
  constructor(http: HttpRequest, url: string, protected locationUrl: string) {
    super(http, url, locationRateModel);
    this.searchGet = true;
    this.getLocationByLocationId = this.getLocationByLocationId.bind(this);
  }
  getLocationByLocationId(locationId: string): Promise<LocationRate[]> {
    const url = this.locationUrl + '/' + locationId;
    return this.http.get(url);
  }
}
