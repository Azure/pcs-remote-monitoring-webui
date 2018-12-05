// Copyright (c) Microsoft. All rights reserved.

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Deployments } from './deployments';
import {
  getDeploymentsError,
  getDeploymentsPendingStatus,
  getDeployments,
  getDeploymentsLastUpdated,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';
import {
  redux as appRedux,
  epics as appEpics,
} from 'store/reducers/appReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getDeploymentsPendingStatus(state),
  error: getDeploymentsError(state),
  deployments: getDeployments(state),
  lastUpdated: getDeploymentsLastUpdated(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  fetchDeployments: () => dispatch(deploymentsEpics.actions.fetchDeployments()),
  updateCurrentWindow: (currentWindow) => dispatch(appRedux.actions.updateCurrentWindow(currentWindow)),
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const DeploymentsContainer = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Deployments));
