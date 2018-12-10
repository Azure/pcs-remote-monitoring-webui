// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { epics as appEpics } from 'store/reducers/appReducer';
import { TelemetryChart } from './telemetryChart'


const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const TelemetryChartContainer = connect(null, mapDispatchToProps)(TelemetryChart);
