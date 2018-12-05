// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Packages } from './packages';
import {
  epics as packagesEpics,
  getPackages,
  getPackagesError,
  getPackagesLastUpdated,
  getPackagesPendingStatus
} from 'store/reducers/packagesReducer';
import {
  redux as appRedux,
  epics as appEpics,
} from 'store/reducers/appReducer';

// Pass the packages status
const mapStateToProps = state => ({
  packages: getPackages(state),
  error: getPackagesError(state),
  isPending: getPackagesPendingStatus(state),
  lastUpdated: getPackagesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchPackages: () => dispatch(packagesEpics.actions.fetchPackages()),
  updateCurrentWindow: (currentWindow) => dispatch(appRedux.actions.updateCurrentWindow(currentWindow)),
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const PackagesContainer = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Packages));
