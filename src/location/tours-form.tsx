import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
// import { Review } from './review'
import { Location } from './service/location/location'
import imageOnline from '../assets/images/status/online.svg';
import { getLocations } from './service/index';
export const TourForm = () => {
    const { id = '' } = useParams()
    const [location, setLocation] = useState<Location>();
    const locationService = getLocations();
    useEffect(() => {
        getLocation(id ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const getLocation = async (id: string) => {
        const currentLocation = await locationService.load(id)
        if (currentLocation)
            setLocation(currentLocation);
    }
    if (!location)
        return (<div>s</div>)
    return (
        <div className='profile view-container'>

            <form id='locationForm' name='locationForm'>
                <header className='border-bottom-highlight'>
                    <div className='cover-image'>
                        {
                            ((location.thumbnail) && <img alt='' src={`data:image/jpeg;base64,${location.thumbnail}`} />)
                            || (<img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />)
                        }
                        <div className='contact-group'>
                            <button id='btnPhone' name='btnPhone' className='btn-phone' />
                            <button id='btnEmail' name='btnEmail' className='btn-email' />
                        </div>
                        <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
                    </div>
                    <button id='btnCamera' name='btnCamera' className='btn-camera' />
                    <div className='avatar-wrapper'>
                        <img alt='' className='avatar' src={location.imageURL || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} />
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
                            <li><Link to={`/tripal/location/${id}`}  > Overview </Link></li>
                            <li><Link to={`/tripal/location/${id}/bookable`}  > Bookable </Link></li>
                            <li><Link to={`/location/${id}/review`}  > Review </Link></li>
                            <li><Link to={`/tripal/location/${id}/photo`}  > Photo </Link></li>
                            <li><Link to={`/tripal/location/${id}/about`}  > About </Link></li>
                        </ul>
                    </nav>
                </header>
                <div className='row'>
                    <Routes>
                        {/* <Route path='/location/:id/review' element={() => <Review />} /> */}
                    </Routes>
                    {/* <Route path='/tripal/location/:id'  element={() => <OverView location={location} />} /> */}
                    {/* <Route path='/tripal/location/:id/bookable'  element={() => <Bookable  locationId = {id}  location={props.location} history={props.history}/>} /> */}

                    {/* <Route path='/tripal/location/:id/photo'  element={<Photo/>}/> */}
                    {/* <Route path='/tripal/location/:id/about'  element={<About/>}/> */}
                    {/* <Route path='/tripal/location/:id/bookable/add'  element={() => <AddBooking locationId = {id} recieve={recieve}/>}/> */}
                </div>
            </form>
        </div>
    );
}
