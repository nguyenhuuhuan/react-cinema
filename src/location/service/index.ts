import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { LocationService } from './location/location';
import { LocationClient } from './location';
import { LocationRateService } from './location-rate/location-rate';
import { LocationRateClient } from './location-rate';
export * from './location';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  location_url: string;
  location_rate_url: string;
}
class ApplicationContext {
  locationService?: LocationService;
  locationRateService?: LocationRateService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    this.getLocationRateService = this.getLocationRateService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_url);
    }
    return this.locationService;
  }
  getLocationRateService(): LocationRateService {
    if (!this.locationRateService) {
      const c = this.getConfig();
      this.locationRateService = new LocationRateClient(httpRequest, c.location_rate_url, c.location_url);
    }
    return this.locationRateService;
  }

}

export const context = new ApplicationContext();

export function getLocations(): LocationService {
  return context.getLocationService();
}

export function getLocationRates(): LocationRateService {
  return context.getLocationRateService();
}

