// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../../common/lang';
import * as actions from '../../actions';
import * as uuid from 'uuid/v4';
import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import Config from '../../common/config';
import Spinner from '../spinner/spinner';
import { getTypeOf } from '../../common/utils';
import './deviceReconfigureFlyout.css';

const validReportedProperties = [Config.STATUS_CODES.TYPE, Config.STATUS_CODES.LOCATION, Config.STATUS_CODES.FIRMWARE];

class DeviceReconfigureFlyout extends React.Component {
  constructor() {
    super();
    this.inputReference = {};
    this.state = {
      commonConfiguration: [],
      jobInputValue: '',
      jobApplied: false
    };

    this.commonConfigValueChanged = this.commonConfigValueChanged.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.applyDeviceConfigureJobsData =this.applyDeviceConfigureJobsData.bind(this);
  }

  componentWillMount() {
    this.calcCommonConfiguration(this.props.devices);
  }

  componentWillReceiveProps(nextProps) {
    this.calcCommonConfiguration(nextProps.devices);
  }

  calcCommonConfiguration(devices) {
    const commonConfiguration = [];
    if (!devices) return;
    const uncommonReportedPropValueMap = {};
    /*
    If user selected only one device then it returns all the value from Properties.Reported
    'validReportedProperties' is the type, location and firmware. So taking each key and
    checking wheather the value is present or undefined. It's not mandatory that it should
    have all three.
    */
    if (devices.length === 1) {
      const device = devices[0];
      if (device && device.Properties && device.Properties.Reported) {
        const { Reported } = device.Properties;
        validReportedProperties.forEach(key => {
          if (Reported[key] !== undefined) {
            commonConfiguration.push({
              label: key,
              value: Reported[key],
              type: getTypeOf(Reported[key])
            });
          }
        });
      }
    } else {
    /*
    When user selected multiple devices then, we have to look for validReportedProperties and
    What ever is common return only those validReportedProperties. Sometimes the values of
    those type, location can be different in that Make it value as "Multiple".
    */
      devices.forEach(device => {
        validReportedProperties.forEach(reportedProp => {
          if (!device || !device.Properties || !device.Properties.Reported) {
            uncommonReportedPropValueMap[reportedProp] = true;
            return;
          }
          const { Reported } = device.Properties;
          if (Reported[reportedProp] === undefined || Reported[reportedProp] === null) {
            uncommonReportedPropValueMap[reportedProp] = true;
          }
        });
      });

      // Compute the common property value per reported property across selected devices
      const valuesMap = {};
      devices.forEach(device => {
        if (!device || !device.Properties || !device.Properties.Reported) return;
        const { Reported } = device.Properties;
        validReportedProperties.forEach(reportedProp => {
          if (uncommonReportedPropValueMap[reportedProp]) return;
          if (Reported[reportedProp] !== undefined) {
            if (valuesMap[reportedProp] !== undefined) {
              // If the values are shared across devices, show the value, if not, show 'Multiple'
              valuesMap[reportedProp] =
                valuesMap[reportedProp] === Reported[reportedProp] ? valuesMap[reportedProp] : lang.MULTIPLE;
            } else {
              valuesMap[reportedProp] = Reported[reportedProp];
            }
          }
        });
      });

      Object.keys(valuesMap).forEach(key => {
        commonConfiguration.push({
          label: key,
          value: valuesMap[key],
          type: getTypeOf(valuesMap[key])
        });
      });
    }

    this.setState({ commonConfiguration });
  }

  commonConfigValueChanged(reportedProp, value) {
    const { commonConfiguration } = this.state;
    commonConfiguration.some(item => {
      if (item.label === reportedProp) {
        item.value = value;
        return true;
      }
      return false;
    });
    this.setState({ commonConfiguration });
  }

  onChangeInput(event) {
    this.setState({ jobInputValue: event.target.value });
  }

  applyDeviceConfigureJobsData() {
    const { devices } = this.props;
    const ids = devices.map(device => device.Id);
    const reportedProps = {};
    this.state.commonConfiguration.forEach(item => {
      reportedProps[item.label] = item.value;
    });
    const payload = {
      JobId: uuid(),
      QueryCondition: `deviceId in [${ids.toString()}]`,
      MaxExecutionTimeInSeconds: 0,
      updateTwin: {
        deviceId: `deviceId in [${ids.toString()}]`,
        Properties: {
          Desired: reportedProps
        }
      }
    };

    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(data => {
      this.setState({
        showSpinner: false,
        jobApplied: true
      });
    });
  }

  commonReconfigure() {
    const { commonConfiguration } = this.state;
    if (!commonConfiguration || !commonConfiguration.length) {
      return (
        <div className="no-common-properties-container">
          <div className="no-common-description">
            {lang.DEVICES.NO_AVAILABLE_COMMON_TAGS}
          </div>
          <div className="no-common-description">
            {lang.DEVICES.PLEASE_CHOOSE_DEVICES_WITH_COMMON_TAGS}
          </div>
        </div>
      );
    }

    return (
      <div className="common-reconfigure-container">
        <div className="device-configuration-row name-value-type">
          <span className="device-configuration-items">
            {lang.DEVICE_DETAIL.FIELD}
          </span>
          <span className="device-configuration-items">
            {lang.DEVICE_DETAIL.VALUE}
          </span>
          <span className="device-configuration-items">
            {lang.DEVICE_DETAIL.TYPE}
          </span>
        </div>
        {commonConfiguration.map((item, idx) =>
          <div className="device-configuration-row name-value-type" key={item.label} onClick={() => {this.inputReference[idx] && this.inputReference[idx].focus()}}>
            <span className="device-configuration-items">
              {item.label}
            </span>
            {item.label !== Config.STATUS_CODES.FIRMWARE
              ? <input
                  type="text"
                  className="device-configuration-items value-for-existed-data"
                  onChange={evt => this.commonConfigValueChanged(item.label, evt.target.value)}
                  value={item.value}
                  ref={(ip) => this.inputReference[idx] = ip}
                />
              : <span className="device-configuration-items value-for-existed-data">
                  {item.value}
                </span>}
            <span className="device-configuration-items">
              {item.type}
            </span>
          </div>
        )}
      </div>
    );
  }

  render() {
    let totalEffectedDevices = this.props.devices ? this.props.devices.length : 0;
    const disabledButton = !this.state.jobInputValue;
    return (
      <div className="device-configuration-container">
        <div className="sub-heading">
          {lang.DEVICE_DETAIL.CHOOSE_DEVICE_CONFIGURATION}
        </div>
        <div className="sub-class-heading">
          {lang.DEVICE_DETAIL.AVAILABLE_PROPERTIES}
        </div>
        <div className="job-name-container">
          <div className="label-key">
            {lang.DEVICE_DETAIL.JOB_NAME}
          </div>
          <input
            type="text"
            className="style-manage"
            placeholder={lang.DEVICE_DETAIL.RECONFIGURE_JOB}
            onChange={this.onChangeInput}
            value={this.state.jobInputValue}
          />
        </div>
        {this.commonReconfigure()}
        <div className="summary-container">
          {lang.DEVICE_DETAIL.SUMMARY}
          <div className="effected-devices">
            <span className="num-effected-devices">
              {totalEffectedDevices}
            </span>
            <span className="effected-devices-name">
              {lang.DEVICES.EFFECTED_DEVICES}
            </span>
          </div>
        </div>

        <div className="btn-container">
          <button className="pcs-btn">
            <img src={CancelX} alt={`${CancelX}`} onClick={this.props.onClose} className="cancel-icon" />
            {lang.FILTER.CANCEL}
          </button>
          {this.state.showSpinner && <Spinner size="medium" />}
          {this.state.jobApplied
            ? <button className="pcs-btn primary" disabled type="button">
                <img src={Apply} alt={`${Apply}`} />
                {lang.FLYOUT.APPLIED}
              </button>
            : <button
                className="pcs-btn primary"
                disabled={disabledButton}
                type="button"
                onClick={this.applyDeviceConfigureJobsData}
              >
                {!disabledButton && <img src={Apply} alt={`${Apply}`} />}
                {lang.FLYOUT.APPLY}
              </button>}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

const mapStateToProps = state => {
  return {
    devices: state.flyoutReducer.devices,
    deviceETags: state.flyoutReducer.deviceETags || {}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReconfigureFlyout);
