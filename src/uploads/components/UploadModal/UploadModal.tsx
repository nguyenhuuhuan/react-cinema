import React, { useState } from 'react';
import { OnClick } from 'react-hook-core';
import CropImage from './CropImage';
import Loading from './Loading';
import { dataURLtoFile, State } from './UploadHook';

interface Props {
  file: File | undefined,
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>,
  upload: () => Promise<void>,
  state: State
}

const UploadsModal = (props: Props) => {
  const [cropImage, setCropImage] = useState<string>('');
  const [select, setSelect] = useState<boolean>(false);
  const [isCrop, setIsCrop] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState(false)
  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.files
    if (!data) return
    const fileUpload = data[0];
    if (fileUpload) {
      props.setFile(fileUpload);
    }
  };
  const handleDelete = () => {
    props.setFile(undefined);
    if (cropImage) {
      setCropImage('');
      setSelect(false);
      setIsCrop(false);
    }
  };

  const handleSelectCropImage = (e:OnClick) => {
    e.preventDefault()
    if (cropImage && props.file) {
      props.setFile(dataURLtoFile(cropImage, props.file.name));
      setIsCrop(true);
      setSelect(true);
    }
  };

  const togglePreview = (e:OnClick) => {
    e.preventDefault()
    setIsPreview(!isPreview)
  }

  return (
    <div className='upload-modal'>
      <div className='frame'>
        <div className='center'>
          {props.file && props.file !== null ? (
            <>
              <p className='file-name'>{props.file.name}</p>
              <button onClick={togglePreview}>Preview</button>
              <div className='preview-image'>
                {(props.file.type === 'image/jpeg' || props.file.type === 'image/png') &&
                  <div>
                    {
                      select ? (
                        <img className='image-cut' src={URL.createObjectURL(props.file)} alt='file' />
                      ) : (
                        <>
                          <CropImage image={props.file} setCropImage={setCropImage} isPreview={isPreview} />
                          <button onClick={(e)=>handleSelectCropImage(e)}>Select</button>
                        </>
                      )
                    }
                  </div>
                }
              </div>
              <div className='row btn-area'>
                {props.state.loading ? (
                  <div className='loading col xl5 md5 s5' style={{ position: 'relative' }}>
                    <Loading />
                  </div>
                ) : (
                  <button disabled={props.file.type === 'image' && !isCrop} className='btn col xl5 md5 s5' type='button' onClick={() => props.upload()}>
                    Upload
                  </button>
                )}
                <button disabled={props.state.loading} className='btn remove col xl5 md5 s5' type='button' onClick={handleDelete}>
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <div className='title'>
                <h1>Drop file to upload</h1>
              </div>
              <div className='dropzone'>
                <label className='area' htmlFor='upload'>
                  <div>
                    <img alt='upload' src='http://100dayscss.com/codepen/upload.svg' className='upload-icon' />
                    <p>Or Click Here!</p>
                    <input id='upload' type='file' accept={`*`} className='upload-input' onChange={handleSelectFile} />
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default UploadsModal;
