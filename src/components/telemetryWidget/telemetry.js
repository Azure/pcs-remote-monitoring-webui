// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Radio } from 'react-bootstrap';

import Timeline from '../charts/timeline';
import * as actions from '../../actions';
import Config from '../../common/config';
import DashboardPanel from '../dashboardPanel/dashboardPanel';
import PcsBtn from '../shared/pcsBtn/pcsBtn';

import './telemetry.css';

class Telemetry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pause: false,
      telemetryTypes: new Set(),
      devices: []
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.toggleTelemetryOption = this.toggleTelemetryOption.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
    const devices = devicesList.map(({ Id }) => Id);
    this.timerID = setTimeout(
      () => actions.loadTelemetryMessagesP1M(devices),
      Config.INTERVALS.TELEMETRY_UPDATE_MS
    );
  }

  componentWillReceiveProps(nextProps) {
    const { devices } = nextProps;
    if(!devices || !devices.items.length) return;

    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = 0;
    }
    const deviceIds = devices.items.map(({ Id }) => Id);
    this.timerID = setTimeout(
      () => this.props.actions.loadTelemetryMessagesP1M(deviceIds),
      Config.INTERVALS.TELEMETRY_UPDATE_MS
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  toggleTimer() {
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = 0;
    } else {
      const devicesList = this.props.devices && this.props.devices.items ? this.props.devices.items : [];
      const devices = devicesList.map(({ Id }) => Id);
      this.timerID = setTimeout(
        () => this.props.actions.loadTelemetryMessagesP1M(devices),
        2500
      );
    }
    this.setState({ pause: !this.state.pause });
  }

  handleOptionChange(key) {
    const { actions, devices } = this.props;
    actions.selectTelemetryType(key, devices);
  }

  toggleTelemetryOption(key) {
    const { actions } = this.props;
    actions.toggleTelemetrySubMenu(key);
  }

  render() {
    const { radioBtnOptions, timeline } = this.props;
    const telemetryRadioBtnGroup = radioBtnOptions
      ? Object.keys(radioBtnOptions).sort()
        .map((key, index) =>
          <Radio
            onClick={() => this.handleOptionChange(key)}
            name="telemetryRadioButtonGroup"
            inline
            className={radioBtnOptions[key].selected ? 'btn-selected' : ''}
            checked={radioBtnOptions[key].selected}
            key={index}
          >
            {key} [{radioBtnOptions[key].deviceNames.length}]
          </Radio>
        )
      : null;
    const timelineConfig = {
      ...timeline,
      chartId: this.props.chartId,
      chartConfig: {
        ...timeline.chartConfig,
        bindto: `#${this.props.chartId}`
      }
    };
    return (
      <DashboardPanel
          className="telemetry-panel-container"
          title={'Telemetry'}
          showHeaderSpinner={this.props.showHeaderSpinner}
          showContentSpinner={this.props.showContentSpinner}
          actions={
            <PcsBtn className="pause-button"
              onClick={this.toggleTimer}
              value={this.state.pause ? 'paused' : 'flowing'} />
          }>
        <div className="telemetry-btn-group">
          {telemetryRadioBtnGroup}
        </div>
        <div className="timeline-chart">
          <Timeline {...timelineConfig} />
        </div>
      </DashboardPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    telemetryTypes: state.telemetryReducer.telemetryTypes,
    telemetryByDeviceGroup: state.telemetryReducer.telemetryByDeviceGroup,
    radioBtnOptions: state.telemetryReducer.radioBtnOptions,
    timeline: state.telemetryReducer.timeline,
    showHeaderSpinner: state.indicatorReducer.telemetry,
    showContentSpinner: state.indicatorReducer.mapInitial
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Telemetry);
