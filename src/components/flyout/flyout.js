// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import CloseIcon from '../../assets/icons/X.svg';
import FullWidthIcon from '../../assets/icons/FullWidth.svg';
import DeviceDetailFlyout from './deviceDetailFlyout';
import ManageFiltersFlyout from './manageFiltersFlyout';
import DeviceTagFlyout from './deviceTagFlyout';
import RuleOverviewFlyout from '../ruleOverview/ruleOverview';
import DeviceScheduleFlyout from './deviceScheduleFlyout';
import DeviceReconfigureFlyout from './deviceReconfigureFlyout';
import RuleEditor from '../ruleEditor/ruleEditor';

import './flyout.css';

const getFlyout = (content, onClose) => {
  switch (content.type) {
    case 'Device detail':
      return <DeviceDetailFlyout content={content} onClose={onClose} />;

    case 'Manage Filters':
      return <ManageFiltersFlyout content={content} onClose={onClose} />;

    case 'Rule Detail':
      return <RuleOverviewFlyout content={content} onClose={onClose} />;

    case 'Tag':
      return <DeviceTagFlyout content={content} onClose={onClose} />;

    case 'Device Schedule':
      return <DeviceScheduleFlyout content={content} onClose={onClose} />;

    case 'New Rule':
      return <RuleEditor content={content} onClose={onClose} />;

    case 'Reconfigure':
      return <DeviceReconfigureFlyout content={content} onClose={onClose} />;

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
            {content.title || content.type}
          </div>
          <div>
            <span>
              <img src={FullWidthIcon} {...iconStyle} alt={`${FullWidthIcon}`} />
            </span>
            <span onClick={onClose}>
              <img src={CloseIcon} {...iconStyle} alt={`${CloseIcon}`} />
            </span>
          </div>
        </div>
        {getFlyout(content, onClose)}
      </div>
    : null;
};

export default Flyout;
