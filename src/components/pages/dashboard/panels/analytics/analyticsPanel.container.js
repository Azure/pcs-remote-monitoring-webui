// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { AnalyticsPanel } from './analyticsPanel';
import { getEntities as getRuleEntities } from 'store/reducers/rulesReducer';
import { getEntities as getDeviceEntities } from 'store/reducers/devicesReducer';

// Pass the devices status
const mapStateToProps = state => ({
  rules: getRuleEntities(state),
  devices: getDeviceEntities(state)
});

export const AnalyticsPanelContainer = withNamespaces()(connect(mapStateToProps, null)(AnalyticsPanel));
