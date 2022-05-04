import * as React from "react";

import { FileUploads } from "../../model";
import { typeFile, useUpload } from "./UploadHook";
import UploadsModal from "./UploadModal";
import "./Uploads.scss";

interface Props {
  setFileGallery?: (data: FileUploads[]) => void;
  type: typeFile;
  setURL?: (u: string) => void;
  post: (
    url: string,
    obj: any,
    options?:
      | {
          headers?: Headers | undefined;
        }
      | undefined
  ) => Promise<any>;
  url: string;
  id: string;
}

const Uploads = (props: Props) => {
  const { file, setFile, state, upload } = useUpload({
    post: props.post,
    setURL: props.setURL,
    type: props.type,
    url: props.url,
    id: props.id,
  });

  const handleUpload = async () => {

    if (props.type === "gallery") {
      const gallery = await upload();
      if (props.setFileGallery) props.setFileGallery(gallery);
    } else {
      await upload();
    }
  };

  return (
    <div className="upload" style={{ height: "auto" }}>
      <UploadsModal
        file={file}
        setFile={setFile}
        state={state}
        upload={handleUpload}
      />
    </div>
  );
};
export default Uploads;
