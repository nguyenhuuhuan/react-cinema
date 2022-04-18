import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { LocationRate, LocationRateFilter } from './service/location-rate/location-rate';
import { Location, LocationInfo } from './service/location/location';
import './rate.css';
import moment from 'moment';
import { getLocationRates, getLocations } from './service';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};
ReactModal.setAppElement('#root');
export const Review = () => {
    const params = useParams();
    const [currClass, setCurrClass] = useState<string>('')
    const [voteStar, setVoteStar] = useState<number>()
    const [isOpenRateModal, setIsOpenRateModal] = useState(false)
    const [rateClassName, setRateClassName] = useState<string>()
    const [location, setLocation] = useState<Location>()
    const [rates, setRates] = useState<LocationRate[]>([])
    const [pageSize, setPageSize] = useState(3)
    const [maxLengthReviewText] = useState(65)
    const [resource] = useState(storage.resource().resource())

    const locationRateService = getLocationRates();
    const locationService = getLocations();
    useEffect(() => {
        load()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    const load = async () => {
        const locationRateSM = new LocationRateFilter();
        const { id } = params;
        locationRateSM.locationId = id;
        locationRateSM.limit = pageSize;
        locationRateSM.sort = '-rateTime';
        const location = await locationService.load(id || '');
        const searchResult = await locationRateService.search(locationRateSM);
        setRates(searchResult.list);
        setRateClassName('rate');
        setCurrClass('rate');
        if (location)
            setLocation(location);
    }

    const handleOnclick = (n: number) => {
        const newCurrClass = generateRatingClasses(n);
        setCurrClass(newCurrClass)
        setVoteStar(n)
        setIsOpenRateModal(true)
        setRateClassName(currClass)
    }

    const generateRatingClasses = (n: number) => {
        const className = ['rate'];
        for (let i = 1; i <= n; i++) {
            className.push(`star-${i}`);
        }
        return className.join(' ');
    }

    const handleOnMouseEnter = (n: number) => {
        const rateClassName = generateRatingClasses(n);
        setRateClassName(rateClassName)
    }

    const handleOnMouseLeave = () => {
        setRateClassName(currClass)
    }

    const renderDetailStar = () => {
        const list = [];
        if (!location?.info) return;

        const viewCount = location.info.viewCount;
        for (let i = 5; i > 0; i--) {
            const rate = `rate${i}`
            const value = location.info[rate as keyof LocationInfo] ?? location.info[rate as keyof LocationInfo];
            let percent: number = 0;
            if (viewCount !== 0) {
                percent = Number(value || 0 * 100 / viewCount);
            }
            const numberStar = Array(i).fill(<i className='mdi mdi-flare' />);
            const startDiv = <div className='rv-star'>{numberStar}</div>;
            const endDiv = <div key={i} className='progress'>
                <span style={{ width: `${percent}%` }} />
            </div>;
            const rateDiv = <div className='detail'>{startDiv}{endDiv}</div>;

            list.push(rateDiv);
        }

        return list;
    }

    const renderRatingStar = () => Array.from(Array(5).keys()).map(item => <i
        key={item}
        onClick={() => handleOnclick(item + 1)}
        onMouseEnter={() => handleOnMouseEnter(item + 1)}
        onMouseLeave={() => handleOnMouseLeave()}
    />)

    const renderReviewStar = (value: any) => {
        const starList = Array(5).fill(<i />);
        const classes = Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
        return <div className={`rv-star2 ${classes}`}>{starList}</div>;
    }

    const calculatorPercentStar = (value: any) => Number(value * 100 / 5);

    // const closeModal = (index: any) => {
    //     if (index === 1) {
    //         setIsOpenRateModal(false)
    //         // loadData();
    //     }
    // }

    const moreReview = async (e: any) => {
        e.preventDefault();
        debugger
        const locationRateSM = new LocationRateFilter();
        const { id } = params;
        locationRateSM.locationId = id;
        locationRateSM.limit = pageSize + 3;
        locationRateSM.sort = '-rateTime';
        const searchRates = await locationRateService.search(locationRateSM);

        setRates(searchRates.list);
        setRateClassName('rate');
        setCurrClass('rate');
        setPageSize(pageSize + 3)

    }

    const formatReviewText = (text: string) => {
        if (text && text.length > maxLengthReviewText) {
            let textSub = text.substring(0, maxLengthReviewText);
            textSub = textSub + ' ...';
            const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
            return a;
        } else {
            return <span>{resource.review} {text}</span>;
        }
    }
    if (location && window.location.pathname.includes('review'))
        return (
            <>
                <div className='row top-content'>
                    <div className='col s4 m5 l6 summary' >
                        <div className='score'><span>{(location.info) && Math.ceil(location.info.rate * 100) / 100}</span></div>
                        <div className='average'>
                            <div className='empty-stars' />
                            <div className='full-stars'
                                style={{ width: `${(location.info) && (calculatorPercentStar(location.info.rate) || 0)}%` }} />
                        </div>
                    </div>
                    <div className='col s8 m7 l6'>
                        {renderDetailStar()}
                    </div>
                </div>
                <div className='row mid-content'>
                    <div className='col s12 m12 l12 rating'>
                        <p>{resource.rating_text}</p>
                        <div id='rate' className={rateClassName}>
                            {renderRatingStar()}
                        </div>
                    </div>
                </div>
                <div className='title'>
                    <span><b>{resource.reviews}</b></span>
                </div>
                <ul className='row list-view'>
                    {
                        (
                            rates && rates.length > 0 &&
                            (rates.map((value: LocationRate, index: number) => {
                                return <li key={index} className='col s12 m12 l12 review-custom'>
                                    <section className='card'>
                                        <h4>{value.userId}</h4>
                                        <p>{moment(value.rateTime).format('DD/MM/YYYY')}</p>
                                        {renderReviewStar(value.rate)}
                                        {formatReviewText(value.review ?? '')}
                                    </section>
                                </li>;
                            }) || '')
                        )}
                </ul>
                <div className='col s12 m12 l12 more-reviews-div'>
                    <span className='more-reviews' onClick={moreReview}>
                        <b>MORE REVIEWS</b>
                    </span></div>
                <ReactModal
                    isOpen={isOpenRateModal}
                    style={customStyles}
                    contentLabel='Modal'
                    portalClassName='modal-portal'
                    className='modal-portal-content small-width'
                    bodyOpenClassName='modal-portal-open'
                    overlayClassName='modal-portal-backdrop'>
                    aa
                    {/* <PostRateForm value={voteStar} location={location} closeModal={closeModal} loadData={load} /> */}
                </ReactModal>
            </>
        );
    return null
}
