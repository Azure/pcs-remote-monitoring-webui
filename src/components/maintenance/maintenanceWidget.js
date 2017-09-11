// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import MaintenanceSummary from './maintenanceSummary';
import lang from '../../common/lang';

import './maintenanceWidget.css';

class MaintenanceWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGrid: 'alarms'
    }

    this.selectGrid = this.selectGrid.bind(this);
  }

  selectGrid(e) {
    const selectedGrid = e.currentTarget.textContent === 'Alarms' ? 'alarms' : 'system';
    this.setState({ selectedGrid });
  }


  render() {
    const totalAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open').length;
    const criticalAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open' && (alarm.Rule || {}).Severity === 'critical').length;
    const warningAlarms = (this.props.alarms || []).filter(alarm => alarm.Status === 'open' && (alarm.Rule || {}).Severity === 'warning').length;
    const maintenanceProps = {
      alarms: {
        total: totalAlarms,
        critical: criticalAlarms,
        warning: warningAlarms
      },
        // TODO: remove hardcoded value
      jobs: {
        total: 268,
        failed: 26,
        succeeded: 191
      },
      selectedGrid: this.state.selectedGrid
    };
    const alarmSelected = this.state.selectedGrid === 'alarms' ? '-active' : '';
    const systemSelected = this.state.selectedGrid === 'alarms' ? '' : '-active';
    return (
      <div className="maintenance-container">
        <MaintenanceSummary {...maintenanceProps} />
        <div className="selection-bar">
          <div className={`selection-item${alarmSelected}`} onClick={this.selectGrid}>{lang.ALARMS}</div>
          <div className={`selection-item${systemSelected}`} onClick={this.selectGrid}>{lang.SYSTEM_STATUS}</div>
        </div>
        {
          this.state.selectedGrid === 'alarms'
          ? 'alarms'
          : 'system'
        }
      </div>
    );
  }
}

export default MaintenanceWidget;
