// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { ManageDeviceGroups } from './manageDeviceGroups';
import {
  redux as appRedux,
  getDeviceGroups,
  getActiveDeviceGroupId
} from 'store/reducers/appReducer';

const mapStateToProps = state => ({
  deviceGroups: getDeviceGroups(state),
  activeDeviceGroupId: getActiveDeviceGroupId(state)
});

const mapDispatchToProps = dispatch => ({
  closeFlyout: () => dispatch(appRedux.actions.setDeviceGroupFlyoutStatus(false)),
  deleteDeviceGroups: (ids) => dispatch(appRedux.actions.deleteDeviceGroups(ids)),
  insertDeviceGroups: (deviceGroups) => dispatch(appRedux.actions.insertDeviceGroups(deviceGroups))
});

export const ManageDeviceGroupsContainer = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(ManageDeviceGroups));
