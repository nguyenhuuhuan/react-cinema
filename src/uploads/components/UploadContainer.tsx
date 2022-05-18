import * as React from 'react';
import ReactModal from 'react-modal';

import { FileUploads } from '../model';
import { typeFile, useUpload } from './UploadHook';
import UploadsModal from './UploadModal';
import './Uploads.scss';

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
  aspect: number;
  sizes: number[];
}

const Uploads = (props: Props) => {
  const [modal, setModal] = React.useState<boolean>(false);

  const { file, setFile, state, upload, setCompletedCrop, setImage } = useUpload({
    validateFile: setModal,
    post: props.post,
    setURL: props.setURL,
    type: props.type,
    url: props.url,
    id: props.id,
    aspect: props.aspect,
    sizes: props.sizes
  });

  const handleUpload = async () => {
    // resize(480)
    if (props.type === 'gallery') {
      const gallery = await upload(props.id);
      if (props.setFileGallery) { props.setFileGallery(gallery); }
    } else {
      await upload(props.id);
    }
  };

  return (
    <div className='upload' style={{ height: 'auto' }}>
      <UploadsModal
        file={file}
        setCompletedCrop={setCompletedCrop}
        setFile={setFile}
        state={state}
        upload={handleUpload}
        aspect={props.aspect}
        setImage={setImage}
      />

      <ReactModal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content small-width-height'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>Edit About</h2>
              <button
                type='button'
                id='btnClose'
                name='btnClose'
                className='btn-close'
                onClick={() => setModal(false)}
              />
            </header>
            <div>
              <section className='row'>
                <div> Image too small, please select a another images</div>
              </section>
            </div>

            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={() => setModal(false)}
              >
                OK
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};
export default Uploads;
