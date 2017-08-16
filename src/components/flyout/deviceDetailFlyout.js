// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Drawer from './drawer';
import JsonViewer from '../jsonViewer/jsonViewer';
import DeviceIcon from '../../assets/icons/DeviceIcon1.svg';
import lang from '../../common/lang';
import ApiService from '../../common/apiService';

import './deviceDetailFlyout.css';

class DeviceDetailFlyout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawMessage: {},
      lastMessageReceived: '',
      showRawMessage: false
    };
  }

  componentDidMount() {
    const { content } = this.props;
    ApiService.getLastTelemetryMessage(content.device.Id).then(data => {
      this.setState({
        rawMessage: data,
        lastMessageReceived: ((data.Items || [])[0] || {}).Time || ''
      });
    });
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
    const { Twin } = device;
    const { reportedProperties, tags, desiredProperties } = Twin;
    const { SupportedMethods } = reportedProperties;

    const deviceMethods = SupportedMethods
      ? SupportedMethods.split(',').map((item, index) =>
          <div key={index}>
            {item}
          </div>
        )
      : null;
    const deviceTags = tags
      ? Object.keys(tags).map((item, index) =>
          <tr key={index}>
            <td>
              {item}
            </td>
            <td>
              {device.Twin.tags[item]}
            </td>
          </tr>
        )
      : null;
    const deviceType = ((reportedProperties || {}).DeviceType || {}).Name || '';
    const deviceSimulated = (Twin || {}).isSimulated || false;
    /*
     * 	Properties shown are: Location, Firmware Version, and Type
     */
    // TODO: confirm firmware obj structure
    const deviceProperties = Object.keys(
      reportedProperties
    ).map((key, index) => {
      if (
        key === lang.DEVICE_DETAIL.DEVICETYPE &&
        reportedProperties[key].Name !== ''
      ) {
        if (
          desiredProperties[key] &&
          desiredProperties[key].Name !== reportedProperties[key].Name
        ) {
          return (
            <tr key={index}>
              <td>
                {key}
              </td>
              <td>
                {reportedProperties[key].Name}
              </td>
              <td>
                `${lang.DEVICE_DETAIL.SYNC} ${reportedProperties[key].Name}`
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
              {reportedProperties[key].Name}
            </td>
          </tr>
        );
      }
      if (key === lang.DEVICE_DETAIL.LOCATION && reportedProperties[key]) {
        const deviceLocation = reportedProperties[key];
        if (
          desiredProperties[key] &&
          desiredProperties[key] !== reportedProperties[key]
        ) {
          const desiredLocation = desiredProperties[key];
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
      if (key === 'Firmware' && reportedProperties[key]) {
        const deviceFirmware = reportedProperties[key];
        if (
          desiredProperties[key] &&
          desiredProperties[key] !== reportedProperties[key]
        ) {
          const desiredFirmware = desiredProperties[key];
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
                {deviceSimulated
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
          <p>add telemetry chart</p>
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
            <button onClick={() => this.copyToClipboard(Twin)}>COPY</button>
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
                  <td onClick={this.toggleShowRawMessage}>
                    {lang.DEVICE_DETAIL.CLICK_TO_SHOW}
                  </td>
                </tr>
              </tbody>
            </table>
            {this.state.showRawMessage &&
              <JsonViewer data={this.state.rawMessage} />}
          </div>
        </Drawer>
      </div>
    );
  }
}

export default DeviceDetailFlyout;
