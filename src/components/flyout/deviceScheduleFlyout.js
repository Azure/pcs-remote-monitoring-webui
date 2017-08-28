// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import * as uuid from 'uuid/v4';
import Spinner from '../spinner/spinner';
import Apply from '../../assets/icons/Apply.svg';
import CancelX from '../../assets/icons/CancelX.svg';
import Select from 'react-select';
import ApiService from '../../common/apiService';
import lang from '../../common/lang';

import './deviceScheduleFlyout.css';

const intersection = function(setA, setB) {
  var intersection = new Set();
  for (var elem of setB) {
    if (setA.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
};

class DeviceScheduleFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      methodValue: '',
      jobInputValue: '',
      firmwareURIValue: '',
      showJobContent: false,
      showFirmwareContent: false,
      showSpinner: false,
      jobApplied: false
    };

    this.getAvailableMethods = this.getAvailableMethods.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  getAvailableMethods(devices) {
    if (!devices) {
      return [];
    }
    let emptyMethod = false;
    const methods = devices.map(device => {
      emptyMethod = (device.reportedProperties || {}).SupportedMethods === undefined;
      return new Set(((device.reportedProperties || {}).SupportedMethods || '').split(','));
    });
    if (emptyMethod) {
      return [];
    }
    return [...methods.reduce((a, b) => intersection(a, b))];
  }

  onSelect(value) {
    const newState = {
      methodValue: value,
      showJobContent: !!value,
      showFirmwareContent: value === lang.DEVICE_SCHEDULE.FIRMWARE_OPTION,
      firmwareURIValue: ''
    };
    if (!newState.showJobContent) {
      newState.jobInputValue = '';
    }
    this.setState(newState);
  }

  onChangeInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onConfirm() {
    const ids = this.props.content.devices.map(device => `${device.Id}`);
    const payload = {
      JobId: uuid(),
      QueryCondition: `deviceId in [${ids.toString()}]`,
      MaxExecutionTimeInSeconds: 0,
      MethodParameter: {
        Name: this.state.methodValue
      }
    };
    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(data => {
      console.log('res', data);
      this.setState({
        showSpinner: false,
        jobApplied: true
      })
    });
  }

  render() {
    const { content } = this.props;
    const availableMethods = this.getAvailableMethods(content.devices);
    const methodOptions = availableMethods.map(method => ({
      value: method,
      label: method
    }));
    const disabledButton = !this.state.jobInputValue ||
    !this.state.methodValue ||
    (this.state.showFirmwareContent &&
      !this.state.firmwareURIValue);

    return (
      <div className="device-schdule-flyout">
        {availableMethods.length
          ? <div className="device-schdule-content">
              <div className="content-title">
                {lang.DEVICE_SCHEDULE.METHODS}
              </div>
              <div className="content-description">
                {lang.DEVICE_SCHEDULE.METHODS_DESCRIPTION}
              </div>
              <div className="content-title">
                {lang.DEVICE_SCHEDULE.SELECT_ONE}
              </div>
              <Select
                options={methodOptions}
                value={this.state.methodValue}
                onChange={this.onSelect}
                simpleValue
                searchable={true}
                placeholder={lang.DEVICE_SCHEDULE.SELECT_PLACEHOLDER}
                className="selectStyle-manage"
              />
              {this.state.showJobContent &&
                <div className="job-schedule-section">
                  <div className="content-title">
                    {lang.DEVICE_SCHEDULE.JOB_NAME}
                  </div>
                  <input
                    className="user-input"
                    placeholder={`${lang.DEVICE_SCHEDULE.JOB_NAME_INPUT_PLACEHOLDER}...`}
                    type="text"
                    name="jobInputValue"
                    onChange={this.onChangeInput}
                    value={this.state.jobInputValue}
                  />
                  {this.state.showFirmwareContent &&
                    <div className="firmware-uri-section">
                      <div className="content-title">
                        {lang.DEVICE_SCHEDULE.FIRMWARE_URL}
                      </div>
                      <input
                        className="user-input"
                        name="firmwareURIValue"
                        placeholder={`${lang.DEVICE_SCHEDULE.FIRMWARE_URL_INPUT_PLACEHOLDER}...`}
                        type="text"
                        onChange={this.onChangeInput}
                        value={this.state.firmwareURIValue}
                      />
                    </div>}
                  <div className="device-affected">
                    <span className="device-affected-number">
                      {content.devices.length}
                    </span>
                    {`devices affected`}
                  </div>
                </div>}
              <div className="btn-group">
                <button
                  className="cancel-button"
                  onClick={this.props.onClose}
                  type="button"
                >
                  <img src={CancelX} alt={`${CancelX}`} />
                  {lang.FLYOUT.CANCEL}
                </button>
                {this.state.showSpinner && <Spinner size="medium" />}
                {
                  this.state.jobApplied
                  ? <button
                      className="apply-button "
                      onClick={this.onConfirm}
                      disabled
                      type="button"
                    >
                      <img src={Apply} alt={`${Apply}`} />
                      {lang.FLYOUT.APPLIED}
                    </button>
                  : <button
                      className="apply-button "
                      onClick={this.onConfirm}
                      disabled={disabledButton}
                      type="button"
                    >
                      {!disabledButton && <img src={Apply} alt={`${Apply}`} />}
                      {lang.FLYOUT.APPLY}
                    </button>
                }
              </div>
            </div>
          : <div className="device-schdule-content">
              <div className="content-title">
                {lang.DEVICE_SCHEDULE.CHOOSE_NEW_DEVICES}
              </div>
              <div className="content-description">
                {lang.DEVICE_SCHEDULE.CHOOSE_NEW_DEVICES}
              </div>
            </div>}
      </div>
    );
  }
}

export default connect(null, null)(DeviceScheduleFlyout);
