// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  redux as appRedux,
  getTheme,
  getVersion,
} from 'store/reducers/appReducer';
import { Settings } from './settings';

const mapStateToProps = state => ({
  theme: getTheme(state),
  version: getVersion(state)
});

const mapDispatchToProps = dispatch => ({
  changeTheme: theme => dispatch(appRedux.actions.changeTheme(theme))
});

export const SettingsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Settings));
