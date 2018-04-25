// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { redux as appRedux } from 'store/reducers/appReducer';

import { ManageDeviceGroupsBtn } from './manageDeviceGroupsBtn';

const mapDispatchToProps = dispatch => ({
  openFlyout: () => dispatch(appRedux.actions.setDeviceGroupFlyoutStatus(true))
});

export const ManageDeviceGroupsBtnContainer = translate()(connect(null, mapDispatchToProps)(ManageDeviceGroupsBtn));
