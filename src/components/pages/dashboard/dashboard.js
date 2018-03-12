// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Cell } from './grid';
import {
  MapPanel,
  AlarmsPanelContainer,
  TelemetryPanel,
  KpisPanel
} from './panels';

import './dashboard.css';

export class Dashboard extends Component {
  render () {
    return (
      <div className="dashboard-container">
        <Grid>
          <Cell className="col-6">
            <MapPanel />
          </Cell>
          <Cell className="col-4">
            <AlarmsPanelContainer />
          </Cell>
          <Cell className="col-6">
            <TelemetryPanel />
          </Cell>
          <Cell className="col-4">
            <KpisPanel />
          </Cell>
        </Grid>
      </div>
    );
  }
}
