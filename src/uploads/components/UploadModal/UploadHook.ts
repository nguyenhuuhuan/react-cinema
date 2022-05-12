import axios from "axios";
import * as React from "react";
import { PixelCrop } from "react-image-crop";
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
  aspect: number;
  sizes: number[];
  validateFile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUpload = (props: Props) => {
  const [file, setFile] = React.useState<File>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [image, setImage] = React.useState<HTMLImageElement>();
  const [state, setState] = React.useState<State>({
    success: false,
    loading: false,
  });

  React.useEffect(() => {
    validateFile();
  }, [file]);

  React.useEffect(() => {
    console.log("type", props.type);
  }, [props.type]);

  const validateFile = async () => {
    if (props.type !== "gallery") return;
    const image = await readFileAsync(file);
    if (!image) return;
    for (const size of props.sizes) {
      const height = size / props.aspect;
      if (image.naturalHeight < height || image.naturalWidth < size) {
        props.validateFile(true);
        setFile(undefined);
      }
    }
  };

  const upload = async (id: string): Promise<FileUploads[]> => {
    debugger;
    if (!file) return [];
    let fileCustomSizes: File[] = [];
    setState((pre) => ({ ...pre, loading: true }));
    const bodyFormData = new FormData();
    if (props.type !== "gallery") {
      fileCustomSizes = await resizes(props.sizes);
      bodyFormData.append("files", file);
      fileCustomSizes.forEach((fileCustom) => {
        bodyFormData.append("files", fileCustom);
      });
    } else {
      bodyFormData.append("file", file);
    }

    bodyFormData.append("id", id || "");
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
  };

  function readFileAsync(file: File | undefined): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = function (imageEvent) {
          resolve(image);
        };
        image.onerror = reject;
        image.src = readerEvent.target!.result?.toString() || "";
      };

      reader.onerror = reject;

      if (file) reader.readAsDataURL(file);
    });
  }

  const cropImage = async (): Promise<File | undefined> => {
    if (!completedCrop || !file || !image) {
      return;
    }

    // if(!props.isPreview) return
    if (props.aspect === 0) {
      return;
    }
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    const imagee = new Image();
    imagee.src = canvas.toDataURL(file?.type);
    const newFile = dataURLtoFile(imagee.src, file?.name ?? "");
    return newFile;
  };

  const resizes = async (sizes: number[]): Promise<File[]> => {
    const croptedFile = await cropImage();
    if (!croptedFile) return [];
    let image = await readFileAsync(croptedFile);
    //
    let files: File[] = [];
    sizes.forEach((size) => {
      var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        oc = document.createElement("canvas"),
        octx = oc.getContext("2d");

      canvas.width = size; // destination canvas size
      canvas.height = (canvas.width * image.height) / image.width;
      // var cur = {
      //   width: Math.floor(width * 0.5),
      //   height: Math.floor(height * 0.5),
      // };
      var cur = {
        width: Math.floor(image.width),
        height: Math.floor(image.height),
      };

      oc.width = cur.width;
      oc.height = cur.height;

      octx!.drawImage(image, 0, 0, cur.width, cur.height);

      while (cur.width * 0.5 > size) {
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
      imagee.src = canvas.toDataURL(croptedFile.type);
      const ext = getFileExtension(croptedFile?.name || "");
      const newFile = dataURLtoFile(
        imagee.src,
        removeFileExtension(croptedFile?.name || "") +
          `_${size.toString()}.` +
          ext
      );
      files.push(newFile);
    });
    return files;
  };
  return { file, setFile, state, setState, upload, setCompletedCrop, setImage };
};

export const getImageAvt = async (id: string) => {
  let urlImg = "";
  try {
    const res = await axios.get(urlGetImg + `/${id}`);
    urlImg = res.data;
    return urlImg;
  } catch (e) {
    return urlImg;
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
