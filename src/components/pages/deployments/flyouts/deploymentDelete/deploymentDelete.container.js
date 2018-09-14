// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeploymentDelete } from './deploymentDelete';
import {
  getDeleteDeploymentError,
  getDeleteDeploymentPendingStatus,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getDeleteDeploymentPendingStatus(state),
  error: getDeleteDeploymentError(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  deleteDeployment: deploymentId => dispatch(deploymentsEpics.actions.deleteDeployment(deploymentId))
});

export const DeploymentDeleteContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeploymentDelete));
