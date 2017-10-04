// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Radio } from 'react-bootstrap';
import Rx from 'rxjs';

import Drawer from './drawer';
import JsonViewer from '../jsonViewer/jsonViewer';
import DeviceIcon from '../../assets/icons/DeviceIcon1.svg';
import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import Timeline from '../charts/timeline';
import AlarmsGrid from '../alarmList/alarmsGrid';
import Config from '../../common/config';

import './deviceDetailFlyout.css';

const validTelemetryType = (telemetry, telemetryTypes) =>
  telemetryTypes.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

const getLatestTimestamp = data =>
  Math.max.apply(null, data.map(e => new Date(e.Time)));

const loadTelemetry = (data, deviceId) => {
  if (!data || !deviceId) return {};
  let radioBtnOptions = {};
  const telemetrytypes = data.Properties.filter(e => !e.includes('_'));
  data.Items.filter(item => item.DeviceId === deviceId).forEach(item => {
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
        }
      });
    }
  });
  return radioBtnOptions;
};

class DeviceDetailFlyout extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.errorSubject = new Rx.Subject();
    this.state = {
      deviceId: '',
      rawMessage: {},
      lastMessageReceived: '',
      showRawMessage: false,
      alarmRowData: [],
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
    this.subscriptions.push(
      Rx.Observable
        .interval(Config.INTERVALS.TELEMETRY_UPDATE)
        .startWith(-1)
        .takeUntil(this.errorSubject)
        .subscribe(cnt => this.getData(cnt < 0))
    );
    this.getLastMessage(this.props.content.device.Id);
    this.getAlarms(this.props.content.device.Id)
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  componentWillReceiveProps(nextProps) {
    const deviceId = ((nextProps.content || {}).device || {}).Id;
    if (!deviceId) {
      return;
    }
    if (deviceId !== this.props.content.device.Id) {
      this.getLastMessage(deviceId);
      this.getAlarms(deviceId);
      this.setState(
        {
          deviceId,
          radioBtnOptions: {},
          timeline: {
            ...this.state.timeline,
            destroy: true,
            chartId: `${deviceId}_flyout_chart`,
            selectedTelemetry: '',
            chartConfig: {
              ...this.state.timeline.chartConfig,
              bindto: `${deviceId}_flyout_chart`,
              data: {}
            }
          }
        },
        () => this.getData()
      );
    }
  }

  getLastMessage(id) {
    ApiService.getTelemetryMessages({
      limit: 1,
      order: 'desc',
      devices: id
    }).then(data => {
      this.setState({
        rawMessage: (data.Items || [])[0],
        lastMessageReceived: ((data.Items || [])[0] || {}).Time || ''
      });
    });
  }

  getAlarms(id) {
    ApiService.getAlarms({
      limit: 5,
      order: 'desc',
      devices: id
    }).then(data => {
      this.setState({
        alarmRowData: data.Items.map(item => {
          return {
            ruleId: item.Rule.Id,
            created: item.DateCreated,
            occurrences: item.Count,
            description: item.Rule.Description,
            severity: item.Rule.Severity,
            status: item.Status
          };
        })
      });
    });
  }

  getData() {
    const deviceId = this.state.deviceId
      ? this.state.deviceId
      : ((this.props.content || {}).device || {}).Id;
    let selectedTelemetry = this.state.timeline.selectedTelemetry;
    if (!deviceId) return;
    Rx.Observable
      .fromPromise(ApiService.getTelemetryMessageByDeviceIdP1M(deviceId))
      .subscribe(
        data => {
          let radioBtnOptions = loadTelemetry(data, deviceId);
          if (!radioBtnOptions) {
            return;
          }
          if (selectedTelemetry === '') {
            selectedTelemetry = Object.keys(radioBtnOptions).sort()[0];
            (radioBtnOptions[selectedTelemetry] || {}).selected = true;
          } else {
            Object.keys(radioBtnOptions).forEach(key => {
              radioBtnOptions[key].selected = selectedTelemetry === key;
            });
          }

          let chartData = ((this.state.radioBtnOptions || {})[selectedTelemetry] || {}).chartData || [];
          let latestTimestamp = 0;
          if (chartData.length) {
            latestTimestamp = getLatestTimestamp(chartData);
          }
          const selectedChartData = ((radioBtnOptions[selectedTelemetry] || {})
            .chartData || [])
            .filter(e => new Date(e.Time) > latestTimestamp);
          const rawMessage = (data.Items || [])[0]
            ? (data.Items || [])[0]
            : this.state.rawMessage;
          const lastMessageReceived =
            ((data.Items || [])[0] || {}).Time || ''
              ? ((data.Items || [])[0] || {}).Time || ''
              : this.state.lastMessageReceived;
          const newState = {
            rawMessage,
            lastMessageReceived,
            radioBtnOptions,
            timeline: {
              ...this.state.timeline,
              destroy: false,
              chartId: `${deviceId}_flyout_chart`,
              selectedTelemetry,
              chartConfig: {
                ...this.state.timeline.chartConfig,
                bindto: `${deviceId}_flyout_chart`,
                data: {
                  ...this.state.timeline.chartConfig.data,
                  json: selectedChartData,
                  keys: {
                    value: [deviceId.split('.').join('-')],
                    x: 'Time'
                  }
                }
              }
            }
          };

          this.setState(newState);
        },
        err => {
          this.errorSubject.next(undefined);
        }
      );
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
      },
      () => this.getData(null, selectedKey)
    );
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
      if (key === lang.DEVICETYPE && Reported[key] !== '') {
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
                `${lang.SYNC} ${Reported[key]}`
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
      if (key === lang.LOCATION && Reported[key]) {
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
                `${lang.SYNC} ${desiredLocation}`
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
      if (key === lang.FIRMWARE && Reported[key]) {
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
                `${lang.SYNC} ${desiredFirmware}`
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
    const alarmsGridProps = {
      rowData: this.state.alarmRowData,
      pagination: false
    }
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
                  ? lang.SIMULATED
                  : lang.PHYSICAL}
              </div>
              <div>
                {device.Connected
                  ? lang.CONNECTED
                  : lang.DISCONNECTED}
              </div>
            </div>
          </div>
          <div className="device-alarm-list">
            <AlarmsGrid {...alarmsGridProps} />
          </div>
        </div>
        <Drawer toggle={true} title={lang.TELEMETRY}>
          <div>
            {telemetryRadioBtnGroup}
          </div>
          <div>
            <Timeline {...this.state.timeline} />
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.TAGS}
          description={lang.TAGS_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceTags.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>
                      {lang.KEY}
                    </th>
                    <th>
                      {lang.VALUE}
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
          title={lang.METHODS}
          description={lang.METHODS_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceMethods}
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.PROPERTIES}
          description={lang.PROPERTIES_DESCRIPTION}
        >
          <div className="drawer-content">
            {deviceProperties.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>
                      {lang.PROPERTIES}
                    </th>
                    <th>
                      {lang.VALUE}
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
          title={lang.COPY_TO_CLIPBOARD}
          description={lang.COPY_TO_CLIPBOARD_DESCRIPTION}
        >
          <div className="drawer-content">
            <button onClick={() => this.copyToClipboard(Reported)}>
              {lang.COPY}
            </button>
          </div>
        </Drawer>
        <Drawer
          toggle={true}
          title={lang.DIAGNOSTICS}
          description={lang.DIAGNOSTICS_DESCRIPTION}
        >
          <div className="drawer-content">
            <table>
              <thead>
                <tr>
                  <th>
                    {lang.PROPERTIES}
                  </th>
                  <th>
                    {lang.VALUE}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {lang.STATUS}
                  </td>
                  <td>
                    {lang.CONNECTED}
                  </td>
                </tr>
                <tr>
                  <td>
                    {lang.LAST_MSG}
                  </td>
                  <td>
                    {this.state.lastMessageReceived}
                  </td>
                </tr>
                <tr>
                  <td>
                    {lang.MESSAGE}
                  </td>
                  <td
                    className="show-device-detail-message"
                    onClick={this.toggleShowRawMessage}
                  >
                    {lang.CLICK_TO_SHOW}
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
