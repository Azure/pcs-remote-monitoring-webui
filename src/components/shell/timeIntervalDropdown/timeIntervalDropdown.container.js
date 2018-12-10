// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { epics as appEpics } from 'store/reducers/appReducer';
import { TimeIntervalDropdown } from './timeIntervalDropdown'

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const TimeIntervalDropdownContainer = connect(null, mapDispatchToProps)(TimeIntervalDropdown);
