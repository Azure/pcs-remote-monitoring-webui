// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { epics } from 'store/reducers/appReducer';
import { TimeSeriesInsightsLink } from './timeSeriesInsightsLink';

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(epics.actions.logEvent(diagnosticsModel))
});

export const TimeSeriesInsightsLinkContainer = withNamespaces()(connect(null, mapDispatchToProps)(TimeSeriesInsightsLink));
