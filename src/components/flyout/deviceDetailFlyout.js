// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Radio } from 'react-bootstrap';
import Drawer from './drawer';
import JsonViewer from '../jsonViewer/jsonViewer';
import DeviceIcon from '../../assets/icons/DeviceIcon1.svg';
import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import Timeline from '../charts/timeline';

import './deviceDetailFlyout.css';

const validTelemetryType = (telemetry, telemetryTypes) =>
  telemetryTypes.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

const loadTelemetry = (data, deviceId) => {
  if (!data || !deviceId) return {};
  let radioBtnOptions = {};
  let chartDataSelected = [];
  let displayNames = [];
  let selectedTelemetry = '';
  const telemetrytypes = data.Properties.filter(e => !e.includes('_'));
  data.Items.filter(item => item.DeviceId === deviceId).forEach(item => {
    if (item.Data) {
      Object.keys(item.Data).forEach(telemetry => {
        if (validTelemetryType(telemetry, telemetrytypes)) {
          if (!radioBtnOptions[telemetry]) {
            radioBtnOptions[telemetry] = {
              selected: false,
              chartData: [],
              deviceNames: []
            };
          }
          const option = {};
          const deviceName = item.DeviceId.split('.').join('_');
          option[deviceName] = item.Data[telemetry];
          option['Time'] = new Date(item.Time).toISOString();
          radioBtnOptions[telemetry].chartData.push(option);
          if (
            radioBtnOptions[telemetry].deviceNames.every(e => e !== deviceName)
          ) {
            radioBtnOptions[telemetry].deviceNames.push(deviceName);
          }
        }
      });
    }
  });
  Object.keys(radioBtnOptions).sort().forEach((key, index) => {
    if (!index) {
      radioBtnOptions[key].selected = true;
      selectedTelemetry = key;
      chartDataSelected = [].concat(radioBtnOptions[key].chartData);
      displayNames = [].concat(radioBtnOptions[key].deviceNames);
    }
  });

  return {
    radioBtnOptions,
    selectedTelemetry,
    chartDataSelected,
    displayNames
  };
};

class DeviceDetailFlyout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawMessage: {},
      lastMessageReceived: '',
      showRawMessage: false,
      timeline: {
        selectedTelemetry: '',
        chartConfig: {
          bindto: '#flyout_chart',
          size: {
            height: 250,
            width: 500
          },
          data: {
            json: [],
            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
            keys: {
              x: 'Time',
              value: []
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%H:%M:%S'
              }
            }
          },
          tooltip: {
            format: {
              title: d => d
            }
          },
          zoom: {
            enabled: true
          },
          line: {
            connectNull: true
          }
        },
        chartId: 'flyout_chart'
      }
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    const deviceId = this.props.content.device.Id;
    ApiService.getTelemetryMessageByDeviceIdP1M(deviceId).then(data => {
      const {
        radioBtnOptions,
        selectedTelemetry,
        chartDataSelected,
        displayNames
      } = loadTelemetry(data, deviceId);
      if (!radioBtnOptions || !selectedTelemetry || !chartDataSelected) {
        return;
      }
      this.setState({
        rawMessage: (data.Items || [])[0],
        lastMessageReceived: ((data.Items || [])[0] || {}).Time || '',
        radioBtnOptions,
        chartDataSelected,
        timeline: {
          ...this.state.timeline,
          chartId: `${deviceId}_flyout_chart`,
          selectedTelemetry: selectedTelemetry,
          chartConfig: {
            ...this.state.timeline.chartConfig,
            bindto: `${deviceId}_flyout_chart`,
            data: {
              ...this.state.timeline.chartConfig.data,
              json: chartDataSelected,
              keys: {
                value: displayNames,
                x: 'Time'
              }
            }
          }
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const deviceId = ((nextProps.content || {}).device || {}).Id;
    if (!deviceId) {
      return;
    }
    if (deviceId !== this.props.content.device.Id) {
      ApiService.getTelemetryMessageByDeviceIdP1M(
        nextProps.content.device.Id
      ).then(data => {
        const {
          radioBtnOptions,
          selectedTelemetry,
          chartDataSelected,
          displayNames
        } = loadTelemetry(data, nextProps.content.device.Id);
        if (!radioBtnOptions || !selectedTelemetry || !chartDataSelected) {
          this.setState({
            radioBtnOptions: {},
            chartDataSelected: [],
            timeline: {
              ...this.state.timeline,
              destroy: true,
              chartId: `${deviceId}_flyout_chart`,
              selectedTelemetry: '',
              chartConfig: {
                ...this.state.timeline.chartConfig,
                bindto: `${deviceId}_flyout_chart`,
                data: {
                  ...this.state.timeline.chartConfig.data,
                  json: [],
                  keys: {
                    value: [],
                    x: 'Time'
                  }
                }
              }
            }
          });
        } else {
          this.setState({
            rawMessage: (data.Items || [])[0],
            lastMessageReceived: ((data.Items || [])[0] || {}).Time || '',
            radioBtnOptions,
            chartDataSelected,
            timeline: {
              ...this.state.timeline,
              destroy: false,
              chartId: `${deviceId}_flyout_chart`,
              selectedTelemetry: selectedTelemetry,
              chartConfig: {
                ...this.state.timeline.chartConfig,
                bindto: `${deviceId}_flyout_chart`,
                data: {
                  ...this.state.timeline.chartConfig.data,
                  json: chartDataSelected,
                  keys: {
                    value: displayNames,
                    x: 'Time'
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  copyToClipboard = data => {
    let textField = document.createElement('textarea');
    textField.innerText = JSON.stringify(data, null, 2);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  toggleShowRawMessage = () => {
    this.setState({
      showRawMessage: !this.state.showRawMessage
    });
  };

  handleOptionChange(selectedKey) {
    let newOptions = Object.assign({}, this.state.radioBtnOptions);
    Object.keys(newOptions).forEach(key => {
      newOptions[key].selected = selectedKey === key;
    });
    const newTimeline = Object.assign(
      {},
      {
        ...this.state.timeline,
        selectedTelemetry: selectedKey,
        chartConfig: {
          ...this.state.timeline.chartConfig,
          data: {
            ...this.state.timeline.chartConfig.data,
            json: newOptions[selectedKey].chartData,
            keys: {
              ...this.state.timeline.chartConfig.data.key,
              value: newOptions[selectedKey].deviceNames
            }
          }
        }
      }
    );
    this.setState({
      radioBtnOptions: newOptions,
      timeline: newTimeline
    });
  }

  render() {
    const { device } = this.props.content;
    const { radioBtnOptions } = this.state;
    const { Properties, Tags, IsSimulated } = device;
    const { Reported, Desired } = Properties;
    const { SupportedMethods } = Reported;
    const selectedColor = '#ffffff';
    const unselectedColor = '#afb9c3';
    const telemetryRadioBtnGroup = radioBtnOptions
      ? Object.keys(radioBtnOptions).sort().map((key, index) =>
          <Radio
            onClick={() => this.handleOptionChange(key)}
            name="flyoutRadioButtonGroup"
            inline
            style={{
              color: radioBtnOptions[key].selected
                ? selectedColor
                : unselectedColor
            }}
            checked={radioBtnOptions[key].selected}
            key={`${index}_${key}`}
          >
            {key}
          </Radio>
        )
      : null;
    const deviceMethods = SupportedMethods
      ? SupportedMethods.split(',').map((item, index) =>
          <div key={index}>
            {item}
          </div>
        )
      : null;
    const deviceTags = Tags
      ? Object.keys(Tags).map((item, index) =>
          <tr key={index}>
            <td>
              {item}
            </td>
            <td>
              {Tags[item]}
            </td>
          </tr>
        )
      : null;
    const deviceType = ((Reported || {}).DeviceType || {}).Name || '';
    /*
     * 	Properties shown are: Location, Firmware Version, and Type
     */
    // TODO: confirm firmware obj structure
    const deviceProperties = Object.keys(Reported).map((key, index) => {
      if (key === lang.DEVICE_DETAIL.DEVICETYPE && Reported[key] !== '') {
        if (Desired[key] && Desired[key] !== Reported[key]) {
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {Reported[key]}
              </td>
              <td>
                `${lang.DEVICE_DETAIL.SYNC} ${Reported[key]}`
              </td>
            </tr>
          );
        }
        return (
          <tr key={index}>
            <td>
              {key}
            </td>
            <td>
              {Reported[key]}
            </td>
          </tr>
        );
      }
      if (key === lang.DEVICE_DETAIL.LOCATION && Reported[key]) {
        const deviceLocation = Reported[key];
        if (Desired[key] && Desired[key] !== Reported[key]) {
          const desiredLocation = Desired[key];
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {deviceLocation}
              </td>
              <td>
                `${lang.DEVICE_DETAIL.SYNC} ${desiredLocation}`
              </td>
            </tr>
          );
        }
        if (deviceLocation) {
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {deviceLocation}
              </td>
            </tr>
          );
        }
      }
      if (key === lang.DEVICE_DETAIL.FIRMWARE && Reported[key]) {
        const deviceFirmware = Reported[key];
        if (Desired[key] && Desired[key] !== Reported[key]) {
          const desiredFirmware = Desired[key];
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {deviceFirmware}
              </td>
              <td>
                `${lang.DEVICE_DETAIL.SYNC} ${desiredFirmware}`
              </td>
            </tr>
          );
        }
        if (deviceFirmware) {
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {deviceFirmware}
              </td>
            </tr>
          );
        }
      }
      return null;
    });
    return (
      <div className="device-detail-flyout">
        <div className="device-detail-tile">
          <div className="device-detail">
            <div className="device-icon">
              <img src={DeviceIcon} height="72" alt={`${DeviceIcon}`} />
            </div>
            <div>
              <div className="device-name">
                {device.Id}
              </div>
              <div className="device-status">
                {deviceType}{' '}
                {IsSimulated
                  ? lang.DEVICE_DETAIL.SIMULATED
                  : lang.DEVICE_DETAIL.PHYSICAL}
              </div>
              <div>
                {device.Connected
                  ? lang.DEVICE_DETAIL.CONNECTED
                  : lang.DEVICE_DETAIL.DISCONNECTED}
              </div>
            </div>
          </div>
          <div className="device-alarm-list">alarm list</div>
        </div>
        <Drawer toggle={true} title={lang.DEVICE_DETAIL.TELEMETRY}>
          <div>
            {telemetryRadioBtnGroup}
          </div>
          <div>
            <Timeline {...this.state.timeline} />
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.DEVICE_DETAIL.TAGS}
          description={lang.DEVICE_DETAIL.TAGS_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceTags.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>
                      {lang.DEVICE_DETAIL.KEY}
                    </th>
                    <th>
                      {lang.DEVICE_DETAIL.VALUE}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceTags}
                </tbody>
              </table>}
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.DEVICE_DETAIL.METHODS}
          description={lang.DEVICE_DETAIL.METHODS_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceMethods}
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.DEVICE_DETAIL.PROPERTIES}
          description={lang.DEVICE_DETAIL.PROPERTIES_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceProperties.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>
                      {lang.DEVICE_DETAIL.PROPERTIES}
                    </th>
                    <th>
                      {lang.DEVICE_DETAIL.VALUE}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceProperties}
                </tbody>
              </table>}
          </div>
        </Drawer>
        <Drawer
          toggle={false}
          title={lang.DEVICE_DETAIL.COPY_TO_CLIPBOARD}
          description={lang.DEVICE_DETAIL.COPY_TO_CLIPBOARD_DESCRIPTION}
        >
          <div className="drawer-content">
            <button onClick={() => this.copyToClipboard(Reported)}>
              {lang.DEVICE_DETAIL.COPY}
            </button>
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.DEVICE_DETAIL.DIAGNOSTICS}
          description={lang.DEVICE_DETAIL.DIAGNOSTICS_DESCRIPTION}
        >
          <div className="drawer-content">
            <table>
              <thead>
                <tr>
                  <th>
                    {lang.DEVICE_DETAIL.PROPERTIES}
                  </th>
                  <th>
                    {lang.DEVICE_DETAIL.VALUE}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {lang.DEVICE_DETAIL.STATUS}
                  </td>
                  <td>
                    {lang.DEVICE_DETAIL.CONNECTED}
                  </td>
                </tr>
                <tr>
                  <td>
                    {lang.DEVICE_DETAIL.LAST_MSG}
                  </td>
                  <td>
                    {this.state.lastMessageReceived}
                  </td>
                </tr>
                <tr>
                  <td>
                    {lang.DEVICE_DETAIL.MESSAGE}
                  </td>
                  <td
                    className="show-device-detail-message"
                    onClick={this.toggleShowRawMessage}
                  >
                    {lang.DEVICE_DETAIL.CLICK_TO_SHOW}
                  </td>
                </tr>
              </tbody>
            </table>
            {this.state.showRawMessage &&
              <JsonViewer showButton={false} data={this.state.rawMessage} />}
          </div>
        </Drawer>
        <div className="flyout-footer">
          <div onClick={this.props.onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

export default DeviceDetailFlyout;
