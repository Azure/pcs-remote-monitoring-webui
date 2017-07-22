// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, Row, Checkbox, Radio } from 'react-bootstrap';
import Timeline from '../charts/timeline';
import * as actions from '../../actions';
import ChevronIcon from '../../assets/icons/Chevron.svg';
import lang from '../../common/lang';

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
            {radioBtnOptions[key].selected &&
              <span onClick={() => this.toggleTelemetryOption(key)}>
                <img
                  src={ChevronIcon}
                  className={
                    radioBtnOptions[key].subMenu
                      ? 'chevron-open'
                      : 'chevron-close'
                  }
                  alt="ChevronIcon"
                />
              </span>}
            {radioBtnOptions[key].subMenu &&
              <div className="subMenu">
                {radioBtnOptions[key].options.map((e, index) =>
                  <Checkbox>
                    {e.DeviceId}
                  </Checkbox>
                )}
                <span
                  className="confirm-btn"
                  onClick={() => this.toggleTelemetryOption(key)}
                >
                  {lang.TELEMETRY.OK}
                </span>
              </div>}
          </Radio>
        )
      : null;

    //TODO: remove sample data using data from service
    const sampleTimeline = {
      chartConfig: {
        bindto: '#timeline',
        data: {
          x: 'x',
          columns: [
            ['x', '2012-12-29', '2012-12-30', '2012-12-31'],
            ['data1', 230, 300, 330],
            ['data2', 190, 230, 200],
            ['data3', 90, 130, 180]
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              rotate: 75,
              format: '%Y-%m-%d'
            }
          }
        },
        zoom: {
          enabled: true
        }
      },
      chartId: 'timeline'
    };

    return (
      <Panel header="Telemetry" bsClass="telemetry-panel">
        <Row>
          {telemetryRadioBtnGroup}
        </Row>
        <Timeline
          chartConfig={sampleTimeline.chartConfig}
          chartId={sampleTimeline.chartId}
        />
        <Row />
      </Panel>
    );
  }
}

const mapStateToProps = state => {
  return {
    telemetryTypes: state.telemetryReducer.telemetryTypes,
    telemetryByDeviceGroup: state.telemetryReducer.telemetryByDeviceGroup,
    radioBtnOptions: state.telemetryReducer.radioBtnOptions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Telemetry);
