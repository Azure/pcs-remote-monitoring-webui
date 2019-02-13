// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { epics as appEpics } from 'store/reducers/appReducer';
import { RefreshBar } from './refreshBar'

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const RefreshBarContainer = connect(null, mapDispatchToProps)(RefreshBar);
