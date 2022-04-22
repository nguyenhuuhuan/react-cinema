import * as React from 'react';
import { useUpload } from './UploadHook';
import UploadsModal from './UploadModal';
import './Uploads.scss';

interface Props {
  handleFetch: () => Promise<void>
}

const Uploads = (props: Props) => {
  const { file, setFile, state, setState, upload } = useUpload();

  const handleUpload = async () => {
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
