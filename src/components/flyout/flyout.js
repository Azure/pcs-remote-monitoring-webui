// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import DeviceDetailFlyout from './deviceDetailFlyout';
import ManageFiltersFlyout from './manageFiltersFlyout';
import DeviceTagFlyout from './deviceTagFlyout';
import DeviceDeletionFlyout from './deviceDeletionFlyout';
import RuleOverviewFlyout from '../ruleOverview/ruleOverview';
import DeviceScheduleFlyout from './deviceScheduleFlyout';
import DeviceReconfigureFlyout from './deviceReconfigureFlyout';
import RuleEditor from '../ruleEditor/ruleEditor';
import DeviceProvisioningWorkflow from '../deviceProvisioningWorkflow/deviceProvisioningWorkflow';
import SettingFlyout from '../settingFlyout/settingFlyout';

import CloseIcon from '../../assets/icons/X.svg';

import './flyout.css';

const getFlyout = (content, onClose) => {
  switch (content.type) {
    case 'Device detail':
      return <DeviceDetailFlyout content={content} onClose={onClose} />;

    case 'Manage filters':
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

    case 'Provision':
      return <DeviceProvisioningWorkflow content={content} onClose={onClose} />;

    case 'Delete':
      return <DeviceDeletionFlyout content={content} onClose={onClose} />;

    case 'Settings':
      return <SettingFlyout content={content} onClose={onClose} />;


    default:
      return null;
  }
};

const Flyout = ({ show, content, onClose }) => {
  return show
    ? <div className="flyout-wrapper">
        <div className="flyout-header">
          <div className="flyout-title">
            {content.title || content.type}
          </div>
          <div className="flyout-actions">
            <button onClick={onClose}>
              <img src={CloseIcon} alt="Close" />
            </button>
          </div>
        </div>
        <div className="flyout-content">
          {getFlyout(content, onClose)}
        </div>
      </div>
    : null;
};

export default Flyout;
