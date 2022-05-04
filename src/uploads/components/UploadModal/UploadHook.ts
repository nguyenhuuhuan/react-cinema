import axios from "axios";
import * as React from "react";
import { UserAccount, options } from "uione";
import { config } from "../../../config";
import { HttpRequest } from "axios-core";
import { FileUploads } from "../../model";

const urlGetImg = "http://localhost:8082/my-profile/image";
export interface State {
  success: boolean;
  loading: boolean;
}
export type typeFile = "cover" | "upload" | "gallery";
interface Props {
  post: (
    url: string,
    obj: any,
    options?:
      | {
          headers?: Headers | undefined;
        }
      | undefined
  ) => Promise<any>;
  setURL?: (u: string) => void;
  type: typeFile;
  url: string;
  id: string;
}
const user: UserAccount = JSON.parse(
  sessionStorage.getItem("authService") || "{}"
) as UserAccount;
export const useUpload = (props: Props) => {
  const [file, setFile] = React.useState<File>();
  const [state, setState] = React.useState<State>({
    success: false,
    loading: false,
  });
  const upload = (): Promise<FileUploads[]> | FileUploads[] => {
    if (file) {
      setState((pre) => ({ ...pre, loading: true }));
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      bodyFormData.append("id", user.id || "");
      bodyFormData.append("source", "google-storage");
      const headers = new Headers();
      headers.append("Content-Type", "multipart/form-data");

      return props
        .post(`${props.url}/${props.id}/${props.type}`, bodyFormData)
        .then(async (res: any) => {
          setState((pre) => ({
            ...pre,
            open: false,
            success: true,
            loading: false,
          }));
          setFile(undefined);
          if (props.setURL) {
            props.setURL(res);
          }
          return res;
        })
        .catch(() => {
          setState((pre) => ({ ...pre, loading: false }));
        });
    }
    return [];
  };
  // config.authentication_url + `/my-profile/${user.id}/cover`
  // config.authentication_url + `/my-profile/${user.id}/gallery`
  // config.authentication_url + `/my-profile/${user.id}/upload`
  // const upload = (url: string) => {
  //   if (file) {
  //     setState((pre) => ({ ...pre, loading: true }));
  //     const bodyFormData = new FormData();
  //     bodyFormData.append("file", file);
  //     bodyFormData.append("id", user.id || "");
  //     // bodyFormData.append('source', 'google-storage');
  //     const headers = new Headers();
  //     headers.append("Content-Type", "multipart/form-data");
  //     return props
  //       .post(url, bodyFormData)
  //       .then(async () => {
  //         setState((pre) => ({
  //           ...pre,
  //           open: false,
  //           success: true,
  //           loading: false,
  //         }));
  //         setFile(undefined);
  //       })
  //       .catch(() => {
  //         setState((pre) => ({ ...pre, loading: false }));
  //       });
  //   }
  // };
  return { file, setFile, state, setState, upload };
};

export const getImageAvt = async () => {
  let urlImg = "";
  if (user) {
    try {
      const res = await axios.get(urlGetImg + `/${user.id}`);
      urlImg = res.data;
      return urlImg;
    } catch (e) {
      return urlImg;
    }
  }
};
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/);
  let type = "";
  if (mime) type = mime[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type });
};
