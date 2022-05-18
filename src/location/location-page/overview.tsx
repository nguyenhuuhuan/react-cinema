import React from 'react';
import { useLocation } from 'react-router-dom';

export const Overview = () => {
  const location = useLocation();
  if (location.pathname.split('/').length === 3) {
    return (
      <div className='row top-content'>
        <div className='col s4 m5 l12 summary' >Overview</div>
      </div>
    );
  }
  return null;
};
