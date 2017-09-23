// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Radio } from 'react-bootstrap';

import ApiService from '../../common/apiService';
import Timeline from '../charts/timeline';

import './telemetry.css';

const validTelemetryType = (telemetry, telemetryTypes) =>
  telemetryTypes.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

class TelemetryWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radioBtnOptions: {},
      timeline: this.props.timeline
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { queryParams } = nextProps;
    if(this.props.queryParams.devices !== queryParams.devices) {
      ApiService.getTelemetryMessages(queryParams).then(data => {
        if (data && data.Items) {
          const {radioBtnOptions, selectedTelemetry, selectedChartData, displayNames} = this.getRadioBtnOptions(data);
          this.setState({
            radioBtnOptions,
            timeline: {
              ...this.state.timeline,
              selectedTelemetry,
              chartConfig: {
                ...this.state.timeline.chartConfig,
                data: {
                  ...this.state.timeline.chartConfig.data,
                  json: selectedChartData,
                  keys: {
                    ...this.state.timeline.chartConfig.data.keys,
                    value: displayNames
                  }
                }
              }
            }
          });
        }
      })
    }
  }

  getRadioBtnOptions(data) {
    if (!data) return {};
    let radioBtnOptions = {};
    let selectedTelemetry = '';
    let selectedChartData = [];
    let displayNames = [];
    /*
    * Properties is an array contains telemetry types and telemetry units
    * telemetry units contains '_' where telemetry types are not
    */
    const telemetrytypes = data.Properties.filter(e => !e.includes('_'));
    data.Items.forEach(item => {
      if (item.Data) {
        Object.keys(item.Data).forEach(telemetry => {
          if (validTelemetryType(telemetry, telemetrytypes)) {
            const deviceName = item.DeviceId.split('.').join('-');
            if (!radioBtnOptions[telemetry]) {
              radioBtnOptions[telemetry] = {
                selected: false,
                chartData: [],
                deviceNames: [deviceName]
              };
            }
            const option = {
              [deviceName]: item.Data[telemetry],
              Time: new Date(item.Time).toISOString()
            };
            radioBtnOptions[telemetry].chartData.push(option);
            if (radioBtnOptions[telemetry].deviceNames.every(e => e !== deviceName)) {
              radioBtnOptions[telemetry].deviceNames.push(deviceName);
            }
            selectedTelemetry = Object.keys(radioBtnOptions).sort()[0];
            (radioBtnOptions[selectedTelemetry] || {}).selected = true;
            selectedChartData = [].concat(radioBtnOptions[selectedTelemetry].chartData);
            displayNames = [].concat(radioBtnOptions[selectedTelemetry].deviceNames);
          }
        });
      }
    });
    return {
      radioBtnOptions,
      selectedTelemetry,
      selectedChartData,
      displayNames
    };
  }

  handleOptionChange(selectedKey) {
    let newOptions = Object.assign({}, this.state.radioBtnOptions);
    Object.keys(newOptions).forEach(key => {
      newOptions[key].selected = selectedKey === key;
    });
    this.setState(
      {
        radioBtnOptions: newOptions,
        timeline: {
          ...this.state.timeline,
          selectedTelemetry: selectedKey,
          chartConfig: {
            ...this.state.timeline.chartConfig,
            data: {
              ...this.state.timeline.chartConfig.data,
              json: [].concat(newOptions[selectedKey].chartData)
            }
          }
        }
      }
    );
  }

  render() {
    const { radioBtnOptions } = this.state;
    const telemetryRadioBtnGroup = radioBtnOptions
      ? Object.keys(radioBtnOptions).sort().map((key, index) =>
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
    return (
      <div className="telemetry-container">
        <div className="telemetry-btn-group">
          {telemetryRadioBtnGroup}
        </div>
        <div className="timeline-chart">
          <Timeline {...this.state.timeline} />
        </div>
      </div>
    );
  }
}

export default TelemetryWidget;
