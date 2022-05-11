import React from "react";
import { OnClick } from "react-hook-core";
import ReactModal from "react-modal";
import UploadFile from "../uploads/app";
import Axios from "axios";
import { HttpRequest } from "axios-core";
import { options, UserAccount } from "uione";
import { config } from "../config";
import { FileUploads } from "../uploads/model";
const httpRequest = new HttpRequest(Axios, options);
const user: UserAccount = JSON.parse(
  sessionStorage.getItem("authService") || "{}"
) as UserAccount;
interface Props {
  modalUploadGalleryOpen: boolean;
  closeModalUploadGallery: (e: OnClick) => void;
  setGallery:(file:FileUploads[])=>void;
}
export const ModalUploadGallery = ({
  modalUploadGalleryOpen,
  closeModalUploadGallery,
  setGallery
}: Props) => {
  const httpPost = (
    url: string,
    obj: any,
    options?: { headers?: Headers | undefined } | undefined
  ): Promise<any> => {
    return httpRequest.post(url, obj, options);
  };
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
          <UploadFile
            setGallery={setGallery}
            type="gallery"
            post={httpPost}
            id={user.id || ""}
            url={config.authentication_url + "/my-profile"}
            sizes={[]}
          />

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
  );
};
