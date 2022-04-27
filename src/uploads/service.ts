import axios from 'axios';
import { UserAccount } from 'uione';
import { FileUploads, Uploads, Thumbnail } from './model';
import { config } from '../config';
const user: UserAccount = JSON.parse(sessionStorage.getItem('authService') || '{}') as UserAccount;
export const fetchImageUploaded = (): Promise<string> | undefined => {
  if (user) {
    return axios.get(config.authentication_url + `/my-profile/fetchImageUploaded/${user.id}`).then(files => {
      return files.data as string;
    });
  }
  return undefined
};
export const fetchImageGalleryUploaded = (): Promise<FileUploads[]> | FileUploads[] => {
  if (user) {
    return axios.get(config.authentication_url + `/my-profile/fetchImageGalleryUploaded/${user.id}`).then(files => {
      return files.data as FileUploads[];
    });
  }
  return []
};
export const deleteFile = (fileUrl: string): Promise<number> | number => {
  if (user) {
    return axios.delete(config.authentication_url + `/my-profile/uploadGallery?userId=${user.id}&url=${fileUrl}`).then(() => {
      return 1;
    }).catch(() => 0);
  }
  return 0;
};
export const deleteFileYoutube = (fileUrl: string): Promise<number> | number => {
  if (user) {
    return axios.delete(config.authentication_url + `/my-profile/uploadGallery/youtube?userId=${user.id}&url=${fileUrl}`).then(() => {
      return 1;
    }).catch(() => 0);
  }
  return 0;
};
export const uploadVideoYoutube = (videoId: string): Promise<number> | number => {
  const body: Uploads = {
    userId: user.id || '',
    data: [{
      source: 'youtube',
      type: 'video',
      url: 'https://www.youtube.com/embed/' + videoId
    }]
  };
  const headers = new Headers();
  return axios.post(config.authentication_url + '/my-profile/uploadGallery/youtube', body, { headers }).then(() => 1).catch(() => 0);
};
export const getUser = (): Promise<string> => {
  return axios.get(config.authentication_url + '/image/users/' + user.id).then(r => r.data).catch(e => e);
};
export const updateData = (data: FileUploads[]): Promise<number> => {
  const body = {  
    data,
    userId: user.id
  };
  return axios.patch(config.authentication_url + '/my-profile/uploadGallery', body).then(r => r.data as number).catch(e => e);
};
const urlYutuServece = 'http://localhost:8081';
export const fetchThumbnailVideo = (videoId: string): Promise<Thumbnail> => {
  return axios.get(urlYutuServece + `/tube/video/${videoId}&thumbnail,standardThumbnail,mediumThumbnail,maxresThumbnail,highThumbnail`).then(thumbnail => {
    return thumbnail.data as Thumbnail;
  });
};
