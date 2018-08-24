// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { NewPackage } from './newPackage';
import {
  getCreatePackageError,
  getCreatePackagePendingStatus,
  epics as packagesEpics
} from 'store/reducers/packagesReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getCreatePackagePendingStatus(state),
  error: getCreatePackageError(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  createPackage: packageModel => dispatch(packagesEpics.actions.createPackage(packageModel))
});

export const NewPackageContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(NewPackage));
