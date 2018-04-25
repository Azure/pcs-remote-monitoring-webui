// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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
  deleteDeviceGroup: (id) => dispatch(appRedux.actions.deleteDeviceGroup(id)),
  insertDeviceGroup: (deviceGroup) => dispatch(appRedux.actions.insertDeviceGroup(deviceGroup))
});

export const ManageDeviceGroupsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(ManageDeviceGroups));
