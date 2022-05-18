import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { alert, message, options, useResource } from 'uione';
import { Link, useParams } from 'react-router-dom';
import imageOnline from '../../assets/images/online.svg';
// import { Review } from './review'
import { Location } from '../../backoffice/service/location/location';
import { Overview } from './overview';
import { Review } from './review';
import ReactModal from 'react-modal';
import { OnClick } from 'react-hook-core';
import Uploads from '../../uploads/components/UploadContainer';
import { config } from '../../config';
import { ModalSelectCover } from '../../my-profile/modal-select-cover';
import { useLocationsService } from '../service';
import { getFileExtension, removeFileExtension } from '../../uploads/components/UploadHook';
export type typeFile = 'cover' | 'upload' | 'gallery';
const httpRequest = new HttpRequest(Axios, options);
export const LocationPage = () => {
  const resource = useResource();
  const { id = '' } = useParams();
  const [location, setLocation] = useState<Location>();
  const locationService = useLocationsService();
  const [modalUpload, setModalUpload] = useState(false);
  const [typeUpload, setTypeUpload] = useState<typeFile>('cover');
  const [aspect, setAspect] = useState<number>(1); 
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [sizes, setSizes] = useState<number[]>([]);
  const [dropdownCover, setDropdownCover] = useState<boolean>(false);
  const [modalSelectGalleryOpen, setModalSelectGalleryOpen] = useState(false);
  useEffect(() => {
    getLocation(id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getLocation = async (locId: string) => {
    const currentLocation = await locationService.load(locId);
    if (currentLocation) {
      setLocation(currentLocation);
      setUploadedCover(currentLocation?.coverURL)
      setUploadedAvatar(currentLocation?.imageURL)
    }
  };
  if (!location) {
    return (<div></div>);
  }


  const openModalUpload = (e: OnClick, type: typeFile) => {
    e.preventDefault();
    setModalUpload(true);
    setTypeUpload(type);
    if (type === 'cover') {
      setAspect(2.7);
      setSizes([576, 768]);
    } else { setAspect(1); }
    setSizes([40, 400]);
  };

  const handleChangeFile = (fi: string | undefined) => {
    if (typeUpload === 'cover') {
      setUploadedCover(fi);
    } else {
      setUploadedAvatar(fi);
    }
  };

  const closeModalUpload = (e: OnClick) => {
    e.preventDefault();
    setModalUpload(false);
  };
  const toggleDropdownCover = (e: OnClick) => {
    e.preventDefault();
    setDropdownCover(!dropdownCover);
  };
  const toggleSelectGallery = (e: OnClick) => {
    e.preventDefault();
    setModalSelectGalleryOpen(!modalSelectGalleryOpen);
  };
  
  const saveImageCover = (e: OnClick, url: string) => {
    e.preventDefault();
    setLocation({ ...location, coverURL: url });
    setUploadedCover(url);
    locationService.update
      ({ ...location, coverURL: url})
      .then((successs) => {
        if (successs) {
          message(resource.success_save_my_profile);
        } else {
          alert(resource.fail_save_my_profile, resource.error);
        }
      });
  };
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };
  return (
    <div className='profile view-container'>

      <form id='locationForm' name='locationForm'>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            {
              ((uploadedCover) && <img alt='' src={uploadedCover} />)
              || (<img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />)
            }
            <div className='contact-group'>
              <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
          </div>
          <button id='btnCamera' name='btnCamera' className='btn-camera' onClick={toggleDropdownCover} />
          <ul
            id='dropdown-basic'
            className={`dropdown-content-profile dropdown-upload-cover ${dropdownCover ? 'show-upload-cover' : ''
              }`}
          >
            <li className='menu' onClick={(e) => openModalUpload(e, 'cover')}>
              Upload
            </li>
            <hr style={{ margin: 0 }} />
            <li className='menu' onClick={toggleSelectGallery}>
              Choose from gallery
            </li>
          </ul>
          <div className='avatar-wrapper'>
            <img alt='' className='avatar' src={getImageBySize(uploadedAvatar,400)  || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} />
            <button
              id='btnCamera'
              name='btnCamera'
              className='btn-camera'
              onClick={(e) => openModalUpload(e, 'upload')}
            />
            <img className='profile-status' alt='status' src={imageOnline} />
          </div>
          <div className='profile-title'>
            <h3>{location.name}</h3>
            <p>{location.description}</p>
            <p>500 followers</p>
          </div>
          {/*
              <div className='card'>
                <h3>{location.locationName}</h3>
                <p>{location.description}</p>
              </div>*/}
          <nav className='menu'>
            <ul>
              <li><Link to={`/location/${id}`}  > Overview </Link></li>
              <li><Link to={`/location/${id}/bookable`}  > Bookable </Link></li>
              <li><Link to={`/location/${id}/review`}  > Review </Link></li>
              <li><Link to={`/location/${id}/photo`}  > Photo </Link></li>
              <li><Link to={`/location/${id}/about`}  > About </Link></li>
            </ul>
          </nav>
        </header>
        <div className='row'>
          <Overview />
          <Review />
        </div>
      </form>
      <ReactModal
        isOpen={modalUpload}
        onRequestClose={closeModalUpload}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>{resource.title_modal_uploads}</h2>
              <button
                type='button'
                id='btnClose'
                name='btnClose'
                className='btn-close'
                onClick={closeModalUpload}
              />
            </header>
            <Uploads
              post={httpRequest.post}
              setURL={(dt) => handleChangeFile(dt)}
              type={typeUpload}
              id={location.id}
              url={config.location_url}
              aspect={aspect}
              sizes={sizes}
            />
            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={closeModalUpload}
              >
                {resource.button_modal_ok}
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
      <ModalSelectCover
        list={location.gallery ?? []}
        modalSelectGalleryOpen={modalSelectGalleryOpen}
        closeModalUploadGallery={toggleSelectGallery}
        setImageCover={saveImageCover}
      />
    </div>
  );
};
