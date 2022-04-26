import React from 'react'
import { OnClick } from 'react-hook-core'
import ReactModal from 'react-modal'
import UploadFile from '../uploads/app'
import Uploads from './UploadModal/UploadContainer'
import UploadsModal from './UploadModal/UploadModal'

interface Props {
  modalUploadGalleryOpen: boolean,
  closeModalUploadGallery: (e: OnClick) => void,
}
export const ModalUploadGallery = ({ modalUploadGalleryOpen, closeModalUploadGallery }: Props) => {
  return (
    <ReactModal
      isOpen={modalUploadGalleryOpen}
      onRequestClose={closeModalUploadGallery}
      contentLabel="Modal"
      // portalClassName='modal-portal'
      className="modal-portal-content"
      bodyOpenClassName="modal-portal-open"
      overlayClassName="modal-portal-backdrop"
    >
      <div className="view-container profile-info">
        <form model-name="data">
          <header>
            <h2>Uploads</h2>
            <button
              type="button"
              id="btnClose"
              name="btnClose"
              className="btn-close"
              onClick={closeModalUploadGallery}
            />
          </header>
          <UploadFile type="gallery" />

          <footer>
            <button
              type="button"
              id="btnSave"
              name="btnSave"
              onClick={closeModalUploadGallery}
            >
              OK
            </button>
          </footer>
        </form>
      </div>

    </ReactModal>
  )
}
