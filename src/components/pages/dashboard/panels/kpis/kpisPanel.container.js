// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { KpisPanel } from './kpisPanel';
import { getEntities as getRuleEntities } from 'store/reducers/rulesReducer';
import { getEntities as getDeviceEntities } from 'store/reducers/devicesReducer';

// Pass the devices status
const mapStateToProps = state => ({
  rules: getRuleEntities(state),
  devices: getDeviceEntities(state)
});

export const KpisPanelContainer = translate()(connect(mapStateToProps, null)(KpisPanel));
