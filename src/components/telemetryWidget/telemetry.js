// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Radio } from 'react-bootstrap';
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
      pause: false
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.toggleTelemetryOption = this.toggleTelemetryOption.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  componentDidMount() {
    const { actions, devices } = this.props;
    this.timerID = setInterval(
      () => actions.loadTelemetryMessagesP1M(devices),
      Config.INTERVALS.TELEMETRY_UPDATE_INTERVAL
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  toggleTimer() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = 0;
    } else {
      this.timerID = setInterval(
        () => this.props.actions.loadTelemetryMessagesP1M(),
        2500
      );
    }
    this.setState({ pause: !this.state.pause });
  }

  handleOptionChange(key) {
    const { actions } = this.props;
    actions.selectTelemetryType(key);
  }

  toggleTelemetryOption(key) {
    const { actions } = this.props;
    actions.toggleTelemetrySubMenu(key);
  }

  render() {
    const { radioBtnOptions, timeline } = this.props;
    const selectedColor = '#ffffff';
    const unselectedColor = '#afb9c3';
    const telemetryRadioBtnGroup = radioBtnOptions
      ? Object.keys(radioBtnOptions).sort().map((key, index) =>
          <Radio
            onClick={() => this.handleOptionChange(key)}
            name="telemetryRadioButtonGroup"
            inline
            style={{
              color: radioBtnOptions[key].selected
                ? selectedColor
                : unselectedColor
            }}
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
          actions={
            <PcsBtn className="pause-button" 
              onClick={this.toggleTimer}
              value={this.state.pause ? 'pause' : 'flowing'} />
          }>
        <Row>
          {telemetryRadioBtnGroup}
        </Row>
        <Row>
          <Timeline {...timelineConfig} />
        </Row>
      </DashboardPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    telemetryTypes: state.telemetryReducer.telemetryTypes,
    telemetryByDeviceGroup: state.telemetryReducer.telemetryByDeviceGroup,
    radioBtnOptions: state.telemetryReducer.radioBtnOptions,
    timeline: state.telemetryReducer.timeline
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Telemetry);
