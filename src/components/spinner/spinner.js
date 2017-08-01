// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import './spinner.css';

/*
*  Spiner will take three types of 'size'
*  ['small', 'medium', 'large']
*  default 'size' is 'large'
*/

const Spinner = ({ size = 'large' }) => {
  return (
    <div className={`styleLibrary waitIndicator ring ${size}`}>
      <div className="dot">
        <span className="inner" />
      </div>
      <div className="dot">
        <span className="inner" />
      </div>
      <div className="dot">
        <span className="inner" />
      </div>
      <div className="dot">
        <span className="inner" />
      </div>
      <div className="dot">
        <span className="inner" />
      </div>
      <div className="dot">
        <span className="inner" />
      </div>
    </div>
  );
};

export default Spinner;
