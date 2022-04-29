
import * as React from 'react';

import { FileUploads } from '../../model';
import { useUpload } from './UploadHook';
import UploadsModal from './UploadModal';
import './Uploads.scss';

export type UploadType = 'gallery' | 'cover';
interface Props {
  setFileCover?: (data: string | undefined) => void,
  setFileGallery?: (data: FileUploads[]) => void,
  type: UploadType,
  setURL?: (u: string) => void,
  post: (url: string, obj: any, options?: {
    headers?: Headers | undefined,
  } | undefined) => Promise<any>
}

const Uploads = (props: Props) => {


  const { file, setFile, state, upload, uploadGallery } = useUpload({ post: props.post, setURL: props.setURL });

  const handleUpload = async () => {
    switch (props.type) {
      case 'gallery':
        const gallery = await uploadGallery()
        if (props.setFileGallery)
          props.setFileGallery(gallery);
        break;
      case 'cover':
        await upload();
        break
      default:
        await upload();
    }
  };

  return (
    <div className='upload' style={{ height: 'auto' }}>
      <UploadsModal file={file} setFile={setFile} state={state} upload={handleUpload} />
    </div>
  );
};
export default Uploads;
