// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Radio } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Rx from 'rxjs';

import Drawer from './drawer';
import JsonViewer from '../jsonViewer/jsonViewer';
import lang from '../../common/lang';
import ApiService from '../../common/apiService';
import Timeline from '../charts/timeline';
import AlarmsGrid from '../alarmList/alarmsGrid';
import Config from '../../common/config';
import * as actions from '../../actions';
import Spinner from '../spinner/spinner';
import PollingManager from '../../common/pollingManager';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import { getStandardTimeFormat } from '../../common/utils';

import CancelX from '../../assets/icons/CancelX.svg';
import ChillerSvg from '../../assets/icons/Chiller.svg';
import ElevatorSvg from '../../assets/icons/Elevator.svg';
import EngineSvg from '../../assets/icons/Engine.svg';
import TruckSvg from '../../assets/icons/Truck.svg';
import PrototypingDeviceSvg from '../../assets/icons/PrototypingDevice.svg';
import DeviceIconSvg from '../../assets/icons/DeviceIcon.svg';

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
            Time: getStandardTimeFormat(item.Time)
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
    this.ruleIDToNameMap = {};
    this.subscriptions = [];
    this.state = {
      deviceId: '',
      rawMessage: {},
      lastMessageReceived: '',
      showRawMessage: false,
      showAlarmsGrid: false,
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
            xFormat: '%Y-%m-%dT%H:%M:%S',
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

    this.pollingManager = new PollingManager();

    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    this.subscriptions.push(
      this.pollingManager
        .stream
        .do(_ => this.refresh(`intervalRefresh`, Config.INTERVALS.TELEMETRY_UPDATE_MS))
        .subscribe(this.handleNewData)
    );
    this.refresh(`initialize`);
    this.getLastMessage(this.props.content.device.Id);
    this.getAlarms(this.props.content.device.Id);
  }

  componentWillMount() {
    this.props.actions.loadRulesList();
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  componentWillReceiveProps(nextProps) {
    const { rulesAndActions } = nextProps;
    if (rulesAndActions) {
      rulesAndActions.forEach(({ Id, Name }) => {
        this.ruleIDToNameMap[Id] = Name;
      });
    }
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
        () => this.refresh(`updatedPropsRefresh`)
      );
    }
  }

  getLastMessage(id) {
    this.setState({ showSpinner: true });
    ApiService.getTelemetryMessages({
      limit: 1,
      order: 'desc',
      devices: id
    }).then(data => {
      this.setState({
        showSpinner: false,
        rawMessage: (data.Items || [])[0],
        lastMessageReceived: ((data.Items || [])[0] || {}).Time || ''
      });
    });
  }

  getAlarms(id) {
    this.setState({ showSpinner: true });
    ApiService.getAlarms({
      limit: 5,
      order: 'desc',
      devices: id
    }).then(data => {
      this.setState({
        showSpinner: false,
        showAlarmsGrid: data.Items.length > 0,
        alarmRowData: data.Items.map(item => {
          return {
            ruleName: this.ruleIDToNameMap[item.Rule.Id] || item.Rule.Id,
            ruleId: item.Rule.Id,
            occurrences: item.Count,
            description: item.Rule.Description,
            severity: item.Rule.Severity,
            status: item.Status
          };
        })
      });
    });
  }

  handleNewData = data => {
    let radioBtnOptions = loadTelemetry(data, data.deviceId);
    if (!radioBtnOptions) {
      return;
    }
    let selectedTelemetry = this.state.timeline.selectedTelemetry;
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
        chartId: `${data.deviceId}_flyout_chart`,
        selectedTelemetry,
        chartConfig: {
          ...this.state.timeline.chartConfig,
          bindto: `${data.deviceId}_flyout_chart`,
          data: {
            ...this.state.timeline.chartConfig.data,
            json: selectedChartData,
            keys: {
              value: [data.deviceId.split('.').join('-')],
              x: 'Time'
            }
          }
        }
      }
    };

    this.setState(newState);
  }

  createGetDataEvent = (eventName) => {
    const deviceId = this.state.deviceId
      ? this.state.deviceId
      : ((this.props.content || {}).device || {}).Id;
    return Rx.Observable.of(deviceId)
      .filter(id => id) // Ignore undefined device Ids
      .flatMap(id => ApiService.getTelemetryMessageByDeviceIdP1M(id))
      .do(response => response.deviceId = deviceId);
  };

  refresh(eventName, delayAmount) {
    this.pollingManager.emit(eventName, this.createGetDataEvent, delayAmount);
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
      () => this.refresh(`optionChangeRefresh`)
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
      if (key === lang.TYPE && Reported[key] !== '') {
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
                {`${lang.SYNCING} ${Desired[key]}`}
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
                `${lang.SYNCING} ${desiredLocation}`
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
                `${lang.SYNCING} ${desiredFirmware}`
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
    const deviceTypeMappings = {
       Chiller: ChillerSvg,
       Elevator: ElevatorSvg,
       Engine: EngineSvg,
       Prototyping: PrototypingDeviceSvg,
       Truck: TruckSvg
    };
    const deviceIconType = device.Properties.Reported.Type;
    const svg = deviceTypeMappings[deviceIconType] || DeviceIconSvg;
    return (
      <div className="device-detail-flyout">
        <div className="device-detail-tile">
          <div className="device-detail">
            <div className="device-icon">
              <img src={svg} className="device-renderer-icon" alt="device icon" />
            </div>
            <div>
              <div className="device-name">
                {device.Id}
              </div>
              <div className="device-status">
                {deviceType}{' '}
                {IsSimulated ? lang.SIMULATED : lang.PHYSICAL}
              </div>
              <div>{device.Connected ? lang.CONNECTED : lang.DISCONNECTED}</div>
            </div>
          </div>
          <div className="spinner-onalarmGrid">{this.state.showSpinner && <Spinner size="large"/>}</div>
          {
            this.state.showAlarmsGrid &&
            <div className="device-alarm-list">
              <AlarmsGrid {...alarmsGridProps} />
            </div>
          }
        </div>
        <Drawer toggle={true} title={lang.TELEMETRY}>
          <div className="spinner-onalarmGrid">{this.state.showSpinner && <Spinner size="large"/>}</div>
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
        <div className="btn-group">
            <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CLOSE}</PcsBtn>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rulesAndActions: state.ruleReducer.rulesAndActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetailFlyout);
