// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { NewPackage } from './newPackage';
import { epics as packagesEpics } from 'store/reducers/packagesReducer';

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  createPackage: (packageObj) => dispatch(packagesEpics.actions.createPackage(packageObj))
});

export const NewPackageContainer = translate()(connect(null, mapDispatchToProps)(NewPackage));
