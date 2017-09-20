// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import * as uuid from 'uuid/v4';
import _ from 'lodash';

import Spinner from '../spinner/spinner';
import Apply from '../../assets/icons/Apply.svg';
import CancelX from '../../assets/icons/CancelX.svg';
import Select from 'react-select';
import ApiService from '../../common/apiService';
import lang from '../../common/lang';

import './deviceScheduleFlyout.css';

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
    const methods = devices
      .map(device => (device.Properties || {}).Reported || {})
      .map(({ SupportedMethods }) => SupportedMethods || '')
      .map(methods => (methods || '').split(',').map(method => method.trim()));
    return _.intersection.apply(_, methods);
  }

  onSelect(value) {
    const newState = {
      methodValue: value,
      showJobContent: !!value,
      showFirmwareContent: value === lang.FIRMWARE_OPTION,
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
    const deviceIds = this.props.devices
      .map(({ Id }) => `'${Id}'`).join(',');
    const payload = {
      JobId: this.state.jobInputValue ? this.state.jobInputValue + '-' + uuid(): uuid(),
      QueryCondition: `deviceId in [${deviceIds}]`,
      MaxExecutionTimeInSeconds: 0,
      MethodParameter: {
        Name: this.state.methodValue
      }
    };
    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(data => {
      this.setState({
        showSpinner: false,
        jobApplied: true
      })
    });
  }

  render() {
    const { devices } = this.props;
    const availableMethods = this.getAvailableMethods(devices);
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
                {lang.METHODS}
              </div>
              <div className="content-description">
                {lang.METHODS_DESCRIPTION}
              </div>
              <div className="content-title">
                {lang.SELECT_ONE}
              </div>
              <Select
                options={methodOptions}
                value={this.state.methodValue}
                onChange={this.onSelect}
                simpleValue
                searchable={true}
                placeholder={lang.SELECT_PLACEHOLDER}
                className="selectStyle-manage"
              />
              {this.state.showJobContent &&
                <div className="job-schedule-section">
                  <div className="content-title">
                    {lang.JOB_NAME}
                  </div>
                  <input
                    className="user-input"
                    placeholder={`${lang.JOB_NAME_INPUT_PLACEHOLDER}...`}
                    type="text"
                    name="jobInputValue"
                    onChange={this.onChangeInput}
                    value={this.state.jobInputValue}
                  />
                  {this.state.showFirmwareContent &&
                    <div className="firmware-uri-section">
                      <div className="content-title">
                        {lang.FIRMWARE_URL}
                      </div>
                      <input
                        className="user-input"
                        name="firmwareURIValue"
                        placeholder={`${lang.FIRMWARE_URL_INPUT_PLACEHOLDER}...`}
                        type="text"
                        onChange={this.onChangeInput}
                        value={this.state.firmwareURIValue}
                      />
                    </div>}
                  <div className="device-affected">
                    <span className="device-affected-number">
                      {devices.length}
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
                  {lang.CANCEL}
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
                      {lang.APPLIED}
                    </button>
                  : <button
                      className="apply-button "
                      onClick={this.onConfirm}
                      disabled={disabledButton}
                      type="button"
                    >
                      {!disabledButton && <img src={Apply} alt={`${Apply}`} />}
                      {lang.APPLY}
                    </button>
                }
              </div>
            </div>
          : <div className="device-schdule-content">
              <div className="content-title">
                {lang.CHOOSE_NEW_DEVICES}
              </div>
              <div className="content-description">
                {lang.CHOOSE_NEW_DEVICES}
              </div>
            </div>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { devices: state.flyoutReducer.devices };
};

export default connect(mapStateToProps, null)(DeviceScheduleFlyout);
