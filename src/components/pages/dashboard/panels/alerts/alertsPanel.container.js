// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { epics as appEpics } from 'store/reducers/appReducer';
import { AlertsPanel } from './alertsPanel';

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const AlertsPanelContainer = connect(null, mapDispatchToProps)(AlertsPanel);
