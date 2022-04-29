import React from 'react'
import { OnClick } from 'react-hook-core'
import ReactModal from 'react-modal'
import { FileUploads } from '../admin/users_carousel/model'
import UploadFile from '../uploads/app'
import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options } from 'uione';
const httpRequest = new HttpRequest(Axios, options);

interface Props {
  modalUploadGalleryOpen: boolean,
  closeModalUploadGallery: (e: OnClick) => void
}
export const ModalUploadGallery = ({ modalUploadGalleryOpen, closeModalUploadGallery }: Props) => {
  const httpPost = (url: string, obj: any, options?: { headers?: Headers | undefined, } | undefined): Promise<any> => {
    return httpRequest.post(url, obj, options)
  }
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
          <UploadFile type="gallery" post={httpPost} />

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
