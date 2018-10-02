// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Packages } from './packages';
import {
  epics as packagesEpics,
  getPackages,
  getPackagesError,
  getPackagesLastUpdated,
  getPackagesPendingStatus
} from 'store/reducers/packagesReducer';

// Pass the packages status
const mapStateToProps = state => ({
  packages: getPackages(state),
  error: getPackagesError(state),
  isPending: getPackagesPendingStatus(state),
  lastUpdated: getPackagesLastUpdated(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  fetchPackages: () => dispatch(packagesEpics.actions.fetchPackages())
});

export const PackagesContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Packages));
