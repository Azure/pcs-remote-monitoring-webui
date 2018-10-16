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
  getDeleteDeploymentError,
  getDeleteDeploymentPendingStatus,
  epics as deploymentsEpics,
  redux as deploymentsRedux
} from 'store/reducers/deploymentsReducer';
import {
  redux as appRedux,
  epics as appEpics,
} from 'store/reducers/appReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getCurrentDeploymentDetailsPendingStatus(state),
  error: getCurrentDeploymentDetailsError(state),
  currentDeployment: getCurrentDeploymentDetails(state),
  isDeployedDevicesPending: getDeployedDevicesPendingStatus(state),
  deployedDevicesError: getDeployedDevicesError(state),
  deployedDevices: getDeployedDevices(state),
  lastUpdated: getCurrentDeploymentLastUpdated(state),
  deleteIsPending: getDeleteDeploymentPendingStatus(state),
  deleteError: getDeleteDeploymentError(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  fetchDeployment: id => dispatch(deploymentsEpics.actions.fetchDeployment(id)),
  resetDeployedDevices: () => dispatch(deploymentsRedux.actions.resetDeployedDevices()),
  deleteItem: deploymentId => dispatch(deploymentsEpics.actions.deleteDeployment(deploymentId)),
  updateCurrentWindow: (currentWindow) => dispatch(appRedux.actions.updateCurrentWindow(currentWindow)),
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const DeploymentDetailsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeploymentDetails));
