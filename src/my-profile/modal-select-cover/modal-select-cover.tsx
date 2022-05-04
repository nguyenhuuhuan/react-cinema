import Axios from "axios";
import React from "react";
import { OnClick } from "react-hook-core";
import ReactModal from "react-modal";
import { FileUploads } from "../../uploads/model";
import "./modal-select-cover.css";
interface Props {
  modalSelectGalleryOpen: boolean;
  closeModalUploadGallery: (e: OnClick) => void;
  list: FileUploads[];
  setImageCover:(e:OnClick,url:string)=>void
}
export const ModalSelectCover = ({
  list,
  modalSelectGalleryOpen,
  closeModalUploadGallery,
  setImageCover
}: Props) => {


  return (
    <ReactModal
      isOpen={modalSelectGalleryOpen}
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
            <h2>Select gallery</h2>
            <button
              type="button"
              id="btnClose"
              name="btnClose"
              className="btn-close"
              onClick={closeModalUploadGallery}
            />
          </header>
          <body className="container-gallery">
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((gallery, i) => (
                  <div key={i} className="col s12 m6 l4 xl3 card-gallery">
                    <img
                      className="image-uploaded"
                      src={gallery.url}
                      alt="image-uploads"
                    />
                    <div key={i} className="mask">
                      <section className="btn-group ">
                        <button
                          className="btn-search"
                          onClick={(e) => setImageCover(e, gallery.url)}
                        >
                          Select
                        </button>
                      </section>
                    </div>
                  </div>
                ))}
            </ul>
          </body>

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
