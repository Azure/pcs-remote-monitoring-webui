// Copyright (c) Microsoft. All rights reserved.

import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { DeploymentDetails } from './deploymentDetails';
import {
  getCurrentDeploymentDetailsError,
  getCurrentDeploymentDetailsPendingStatus,
  getCurrentDeploymentLastUpdated,
  getCurrentDeploymentDetails,
  getDeployedDevicesPendingStatus,
  getDeployedDevicesError,
  getDeployedDevices,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getCurrentDeploymentDetailsPendingStatus(state),
  error: getCurrentDeploymentDetailsError(state),
  currentDeployment: getCurrentDeploymentDetails(state),
  isDeployedDevicesPending: getDeployedDevicesPendingStatus(state),
  deployedDevicesError: getDeployedDevicesError(state),
  deployedDevices: getDeployedDevices(state),
  lastUpdated: getCurrentDeploymentLastUpdated(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  fetchDeployment: (id) => dispatch(deploymentsEpics.actions.fetchDeployment(id))
});

export const DeploymentDetailsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeploymentDetails));
