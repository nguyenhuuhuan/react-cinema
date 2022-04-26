import * as React from 'react';
import { useUpload } from './UploadHook';
import UploadsModal from './UploadModal';
import './Uploads.scss';

export type UploadType = 'gallery' | 'cover';
interface Props {
  handleFetch: () => Promise<void>,
  type: UploadType
}

const Uploads = (props: Props) => {
  const { file, setFile, state, setState, upload, uploadGallery } = useUpload();

  const handleUpload = async () => {
    switch (props.type) {
      case 'gallery':
        uploadGallery()
        break;
      case 'cover':
        upload();
        break
      default:
        upload()
    }
    await upload();
    await props.handleFetch();
  };

  return (
    <div className='upload' style={{ height: 'auto' }}>
      <UploadsModal file={file} setFile={setFile} state={state} upload={handleUpload} />
    </div>
  );
};
export default Uploads;
