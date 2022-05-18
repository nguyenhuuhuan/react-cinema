import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { QueryService } from 'onecore';
import { useState } from 'react';
import { options, storage } from 'uione';
import { QueryClient } from 'web-clients';
import { FileUploads } from '../../uploads/model';
import { MyProfileService, User, UserSettings } from './user';

export * from './user';

const httpRequest = new HttpRequest(axios, options);

export class MyProfileClient implements MyProfileService {
  constructor(private http: HttpRequest, private url: string) {
    this.getMyProfile = this.getMyProfile.bind(this);
    this.getMySettings = this.getMySettings.bind(this);
  }
  getMyProfile(id: string): Promise<User | null> {
    const url = this.url + '/' + id;
    return this.http.get<User>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  getMySettings(id: string): Promise<UserSettings | null> {
    const url = this.url + '/' + id + '/settings';
    return this.http.get<UserSettings>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }

  saveMySettings(id: string, settings: UserSettings): Promise<number> {
    return this.http.patch<number>(this.url + '/' + id + '/settings', settings).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  saveMyProfile(usr: User): Promise<number> {
    const url = this.url + '/' + usr.userId;
    return this.http.patch<number>(url, usr).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }

  fetchImageUploaded(): Promise<FileUploads | null> {
    const userId = storage.getUserId();
    return this.http.get<FileUploads>(this.url + `/${userId}/fetchImageUploaded/`).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  fetchImageUploadedGallery(): Promise<FileUploads[] | []> {
    const userId = storage.getUserId();
    return this.http.get<FileUploads[]>(this.url + `/${userId}/fetchImageGalleryUploaded`).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return [];
      }
      throw err;
    });
  }
}

export interface Config {
  myprofile_url: string;
  skill_url: string;
  interest_url: string;
  looking_for_url: string;
}
class ApplicationContext {
  userService?: MyProfileService;
  skillService?: QueryService<string>;
  interestService?: QueryService<string>;
  lookingForService?: QueryService<string>;
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): MyProfileService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new MyProfileClient(httpRequest, c.myprofile_url);
    }
    return this.userService;
  }
  getSkillService(): QueryService<string> {
    if (!this.skillService) {
      const c = this.getConfig();
      this.skillService = new QueryClient<string>(httpRequest, c.skill_url);
    }
    return this.skillService;
  }
  getInterestService(): QueryService<string> {
    if (!this.interestService) {
      const c = this.getConfig();
      this.interestService = new QueryClient<string>(httpRequest, c.interest_url);
    }
    return this.interestService;
  }

  getLookingForService(): QueryService<string> {
    if (!this.lookingForService) {
      const c = this.getConfig();
      this.lookingForService = new QueryClient<string>(httpRequest, c.looking_for_url);
    }
    return this.lookingForService;
  }
}

export const context = new ApplicationContext();
export function useMyProfileService(): MyProfileService {
  const [service] = useState(() => context.getMyProfileService());
  return service;
}

export function useSkillService(): QueryService<string> {
  const [service] = useState(() => context.getSkillService());
  return service;
}
export function useInterestService(): QueryService<string> {
  const [service] = useState(() => context.getInterestService());
  return service;
}

export function useLookingForService(): QueryService<string> {
  const [service] = useState(() => context.getLookingForService());
  return service;
}
