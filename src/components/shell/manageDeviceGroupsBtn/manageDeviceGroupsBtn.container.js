// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { redux as appRedux } from 'store/reducers/appReducer';

import { ManageDeviceGroupsBtn } from './manageDeviceGroupsBtn';

const mapDispatchToProps = dispatch => ({
  openFlyout: () => dispatch(appRedux.actions.setDeviceGroupFlyoutStatus(true))
});

export const ManageDeviceGroupsBtnContainer = withNamespaces()(connect(null, mapDispatchToProps)(ManageDeviceGroupsBtn));
