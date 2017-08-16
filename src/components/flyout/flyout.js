// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import CloseIcon from '../../assets/icons/X.svg';
import FullWidthIcon from '../../assets/icons/FullWidth.svg';
import DeviceDetailFlyout from './deviceDetailFlyout';

import './flyout.css';

const getFlyout = (content, onClose) => {
  switch (content.type) {
    case 'Device detail':
      return <DeviceDetailFlyout content={content} onClose={onClose} />;

    default:
      return null;
  }
};

const Flyout = ({ show, content, onClose }) => {
  const iconStyle = {
    height: 16,
    width: 16
  };
  return show
    ? <div className="flyout-wrapper">
        <div className="flyout-header">
          <div>
            {content.type}
          </div>
          <div>
            <span>
              <img
                src={FullWidthIcon}
                {...iconStyle}
                alt={`${FullWidthIcon}`}
              />
            </span>
            <span onClick={onClose}>
              <img src={CloseIcon} {...iconStyle} alt={`${CloseIcon}`} />
            </span>
          </div>
        </div>
        {getFlyout(content, onClose)}
        <div className="flyout-footer">
          <div onClick={onClose}>Cancel</div>
        </div>
      </div>
    : null;
};

export default Flyout;
