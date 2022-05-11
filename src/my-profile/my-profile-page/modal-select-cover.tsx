import { OnClick } from "react-hook-core";
import ReactModal from "react-modal";
import { useResource } from "uione";
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
  const resource = useResource();

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
            <h2>{resource.title_select_gallery}</h2>
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
                      alt="image_uploads"
                    />
                    <div key={i} className="mask">
                      <section className="btn-group ">
                        <button
                          className="btn-search"
                          onClick={(e) => setImageCover(e, gallery.url)} 
                        >
                          {resource.button_select}
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
              {resource.button_modal_ok}
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  );
};
