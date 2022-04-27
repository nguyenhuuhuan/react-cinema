import axios from "axios";
import { UserAccount } from "uione";
import { config } from "../../config";
import { FileUploads, Thumbnail } from "./model";

const url = 'http://localhost:8082';
const urlYutuServece = "http://localhost:8081";
const user: UserAccount = JSON.parse(
  sessionStorage.getItem("authService") || "{}"
) as UserAccount;
export const fetchImageUploaded = (
  id: string
): Promise<FileUploads[]> | FileUploads[] => {
  if (user) {
    return axios.get(config.location_url + `/uploads/${id}`).then((files) => {
      return files.data as FileUploads[];
    });
  }
  return [];
};

export const fetchThumbnailVideo = (videoId: string): Promise<Thumbnail> => {
  return axios
    .get(
      urlYutuServece +
        `/tube/video/${videoId}&thumbnail,standardThumbnail,mediumThumbnail,maxresThumbnail,highThumbnail`
    )
    .then((thumbnail) => {
      return thumbnail.data as Thumbnail;
    });
};
