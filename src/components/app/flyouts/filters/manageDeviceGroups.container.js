// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getDeviceGroups } from 'store/reducers/appReducer';
import { ManageDeviceGroups } from './manageDeviceGroups';
// import { epics as appEpics } from 'store/reducers/appReducer';

const mapStateToProps = state => ({
  deviceGroups: getDeviceGroups(state),
});

const mapDispatchToProps = dispatch => ({
  // TODO: get following methods from epic for device groups
  // createDeviceGroup: (payload) => dispatch(appEpics.actions.createDeviceGroup(payload)),
  // deleteDeviceGroup: id => dispatch(appRedux.actions.deleteDeviceGroup(id)),
  // editDeviceGroup: (id, payload) => dispatch(appEpics.actions.editDeviceGroup(id, payload)),
  // TODO: get /config/v1/devicegroupfilters
  // getDeviceGroupFilters:
});

export const ManageDeviceGroupsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(ManageDeviceGroups));
