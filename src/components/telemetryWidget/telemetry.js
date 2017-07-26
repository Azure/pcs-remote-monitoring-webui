// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, Row, Radio } from 'react-bootstrap';
import Timeline from '../charts/timeline';
import * as actions from '../../actions';

import './telemetry.css';

class Telemetry extends Component {
  constructor(props) {
    super(props);

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.toggleTelemetryOption = this.toggleTelemetryOption.bind(this);
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
    const { radioBtnOptions } = this.props;
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
            {key} [{radioBtnOptions[key].options.length}]
          </Radio>
        )
      : null;

    return (
      <Panel header="Telemetry" bsClass="telemetry-panel">
        <Row>
          {telemetryRadioBtnGroup}
        </Row>
        <Timeline {...this.props.timeline} />
        <Row />
      </Panel>
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
