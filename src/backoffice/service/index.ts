import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { CategoryClient, CategoryService } from './category';
import { CinemaClient, CinemaService } from './cinema';
import { FilmClient, FilmService } from './film';
import { LocationClient } from './location';
import { LocationRateClient } from './location-rate';
import { LocationRateService } from './location-rate/location-rate';
import { LocationService } from './location/location';
import { MasterDataClient, MasterDataService } from './master-data';

export * from './cinema';
export * from './category';
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  category_url: string;
  film_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
  location_url: string;
  location_rate_url: string;
}
class ApplicationContext {
  cinemaService?: CinemaService;
  categoryService?: CategoryService;
  filmService?: FilmService;
  masterDataService?: MasterDataService;
  locationService?: LocationService;
  locationRateService?: LocationRateService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
    this.getCategoryService = this.getCategoryService.bind(this);
    this.getFilmService = this.getFilmService.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
    this.getLocationRateService = this.getLocationRateService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      console.log('cinema_url ', c.cinema_url);
      this.cinemaService = new CinemaClient(httpRequest, c.cinema_url);
    }
    return this.cinemaService;
  }
  getFilmService(): FilmService {
    if (!this.filmService) {
      const c = this.getConfig();
      this.filmService = new FilmClient(httpRequest, c.film_url);
    }
    return this.filmService;
  }

  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      const c = this.getConfig();
      this.categoryService = new CategoryClient(httpRequest, c.category_url);
    }
    return this.categoryService;
  }

  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
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

export function useCinema(): CinemaService {
  return context.getCinemaService();
}
export function useCategory(): CategoryService {
  return context.getCategoryService();
}
export function useFilm(): FilmService {
  return context.getFilmService();
}
export function useMasterData(): MasterDataService {
  return context.getMasterDataService();
}

export function getLocations(): LocationService {
  return context.getLocationService();
}

export function getLocationRates(): LocationRateService {
  return context.getLocationRateService();
}
