import axios from "axios";
import * as React from "react";
import { UserAccount } from "uione";
import { FileUploads } from "../../model";

const urlGetImg = "http://localhost:8082/my-profile/image";
export interface State {
  success: boolean;
  loading: boolean;
}
export interface ImageInfo {
  width: number,
  height: number,
  image: HTMLImageElement
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

  const upload = async (): Promise<FileUploads[]> => {
    const fileCustomSizes: File[] = await resizes([40, 400])
    if (file && fileCustomSizes) {
      setState((pre) => ({ ...pre, loading: true }));
      const bodyFormData = new FormData();
      bodyFormData.append("files", file);
      fileCustomSizes.forEach(fileCustom => {
        bodyFormData.append("files", fileCustom);
      })
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

  function readFileAsync(file: File): Promise<ImageInfo> {
    return new Promise<ImageInfo>((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = function (imageEvent) {
          resolve({
            width: image.width,
            height: image.height,
            image
          })
        }
        image.onerror = reject;
        image.src = readerEvent.target!.result?.toString() || "";
      };

      reader.onerror = reject;

      if (file) reader.readAsDataURL(file);
    })
  }

  const resizes = async (sizes: number[]): Promise<File[]> => {
    if (!file) return []
    
    let { width, height, image } = await readFileAsync(file);
    //
    let files: File[] = []
    sizes.forEach(size => {
      var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        oc = document.createElement("canvas"),
        octx = oc.getContext("2d");

      canvas.width = size; // destination canvas size
      canvas.height = (canvas.width * height) / width;
      // var cur = {
      //   width: Math.floor(width * 0.5),
      //   height: Math.floor(height * 0.5),
      // };
      var cur = {
        width: Math.floor(width),
        height: Math.floor(height),
      };

      oc.width = cur.width;
      oc.height = cur.height;

      octx!.drawImage(image, 0, 0, cur.width, cur.height);

      while (cur.width * 0.5 > size) {
        debugger
        cur = {
          width: Math.floor(cur.width * 0.5),
          height: Math.floor(cur.height * 0.5),
        };
        octx!.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height
        );
      }
      ctx!.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height
      );
      
      const imagee = new Image();
      imagee.src = canvas.toDataURL(file.type);
      const ext = getFileExtension(file?.name || "");
      const newFile = dataURLtoFile(
        imagee.src,
        removeFileExtension(file?.name || "") + `_${size.toString()}.` + ext
      );
      files.push(newFile)
    })
    return files
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
          octx!.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height
          );
        }
        ctx!.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height
        );

        const imagee = new Image();
        imagee.src = canvas.toDataURL("image/jpeg");
        const ext = getFileExtension(file?.name || "");
        const newFile = dataURLtoFile(
          imagee.src,
          removeFileExtension(file?.name || "") + "_xs." + ext
        );
        // setFileCustomSizes([newFile]);
      };
      image.src = readerEvent.target!.result?.toString() || "";
    };
    if (file) reader.readAsDataURL(file);
  };
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
