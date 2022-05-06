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
  const [file2, setFile2] = React.useState<File>();
  const [state, setState] = React.useState<State>({
    success: false,
    loading: false,
  });

  React.useEffect(()=>{
    resize(480)
  },[file])
  const upload = (): Promise<FileUploads[]> | FileUploads[] => {
    if (file && file2) {
      setState((pre) => ({ ...pre, loading: true }));
      const bodyFormData = new FormData();
      bodyFormData.append("files", file);
      bodyFormData.append("files", file2);
      bodyFormData.append("id", user.id || "");
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

  

  const resize = (width: number) => {
    var reader = new FileReader();
    reader.onload = function (readerEvent) {
      var image = new Image();
      image.onload = function (imageEvent) {
        var canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d"),
          oc = document.createElement("canvas"),
          octx = oc.getContext("2d");

        canvas.width = width; // destination canvas size
        canvas.height = (canvas.width * image.height) / image.width;

        var cur = {
          width: Math.floor(image.width * 0.5),
          height: Math.floor(image.height * 0.5),
        };

        oc.width = cur.width;
        oc.height = cur.height;

        octx!.drawImage(image, 0, 0, cur.width, cur.height);

        while (cur.width * 0.5 > width) {
          cur = {
            width: Math.floor(cur.width * 0.5),
            height: Math.floor(cur.height * 0.5),
          };
          octx!.drawImage(
            oc,
            0,
            0,
            cur.width * 2,
            cur.height * 2,
            0,
            0,
            cur.width,
            cur.height
          );
        }
        ctx!.drawImage(
          oc,
          0,
          0,
          cur.width,
          cur.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        
        const imagee = new Image();
        imagee.src = oc.toDataURL("image/jpeg", 0.85);
        const ext = getFileExtension(file?.name || "");
        const newFile = dataURLtoFile(
          imagee.src,
          removeFileExtension(file?.name || "") + "_xs." + ext
        );
        setFile2(newFile);
        // console.log("origin", file);
        // console.log("resize", newFile);
      };
      image.src = readerEvent.target!.result?.toString() || "";
    };
    if (file) reader.readAsDataURL(file);
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
  return { file, setFile, state, setState, upload, resize };
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
var dataURLToBlob = function (dataURL: string) {
  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
export function removeFileExtension(name: string): string {
  const idx: number = name.lastIndexOf(".");
  return idx >= 0 ? name.substring(0, idx) : name;
}

export function appendFileExtension(s: string, ext: string): string {
  return ext.length > 0 ? s + "." + ext : s;
}

export function getFileExtension(name: string): string {
  const idx: number = name.lastIndexOf(".");
  return idx >= 0 ? name.substring(idx + 1) : "";
}
