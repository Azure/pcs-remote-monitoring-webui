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
import DeepLinkSection from '../deepLinkSection/deepLinkSection';
import lang from '../../common/lang';
import {sanitizeJobName} from '../../common/utils';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';

import './deviceScheduleFlyout.css';

class DeviceScheduleFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      methodValue: '',
      jobInputValue: '',
      firmwareVersionValue: '',
      firmwareURIValue: '',
      showJobContent: false,
      showFirmwareContent: false,
      showSpinner: false,
      jobApplied: false,
      JobId: ''
    };

    this.getAvailableMethods = this.getAvailableMethods.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeJobInput = this.onChangeJobInput.bind(this);
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
      firmwareVersionValue: '',
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

  onChangeJobInput(event) {
    this.setState({ jobInputValue: sanitizeJobName(event.target.value || '') });
  }

  onConfirm() {
    const deviceIds = this.props.devices
      .map(({ Id }) => `'${Id}'`).join(',');

    const jobParameters = {};
    if (this.state.showFirmwareContent) {
      jobParameters["Firmware"] = this.state.firmwareVersionValue;
      jobParameters["FirmwareUri"] = this.state.firmwareURIValue;
    }

    const payload = {
      JobId: this.state.jobInputValue ? this.state.jobInputValue + '-' + uuid(): uuid(),
      QueryCondition: `deviceId in [${deviceIds}]`,
      MaxExecutionTimeInSeconds: 0,
      MethodParameter: {
        Name: this.state.methodValue,
        JsonPayload: JSON.stringify(jobParameters)
      }
    };
    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(({ JobId }) => {
      this.setState({
        showSpinner: false,
        jobApplied: true,
        JobId
      })
    });
  }

  render() {
    const { devices } = this.props;
    const deepLinkSectionProps = {
      path: `/maintenance/job/${this.state.JobId}`,
      description: lang.VIEW_JOB_STATUS,
      linkText: lang.VIEW
    };
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
              {
                this.state.showJobContent &&
                <div className="job-schedule-section">
                  <div className="content-title">
                    {lang.JOB_NAME}
                  </div>
                  <input
                    className="user-input"
                    placeholder={`${lang.JOB_NAME_INPUT_PLACEHOLDER}...`}
                    type="text"
                    name="jobInputValue"
                    onChange={this.onChangeJobInput}
                    value={this.state.jobInputValue}
                  />
                  <div className="jobname-reference">
                    <span className="asterisk">*</span>
                    {lang.JOB_NAME_REFERENCE}
                  </div>
                  {this.state.showFirmwareContent &&
                    <div className="firmware-input-section">
                      <div className="content-title">
                        {lang.FIRMWAREVERSION}
                      </div>
                      <input
                        className="user-input"
                        name="firmwareVersionValue"
                        placeholder={`${lang.FIRMWARE_VERSION_INPUT_PLACEHOLDER}...`}
                        type="text"
                        onChange={this.onChangeInput}
                        value={this.state.firmwareVersionValue}
                      />
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
                    </div>
                  }
                  <SummarySection count={devices.length} content={this.state.jobApplied ? lang.DEVICES_SCHEDULED: lang.AFFECTED_DEVICES} />
                </div>
              }
              {
                !this.state.jobApplied &&
                <div className="btn-group">
                  <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CANCEL}</PcsBtn>
                  {this.state.showSpinner && <Spinner size="medium" />}
                  <PcsBtn svg={Apply}
                    className="primary"
                    onClick={this.onConfirm}
                    disabled={disabledButton}>
                    {lang.APPLY}
                  </PcsBtn>
                </div>
              }
            </div>
            : <div className="device-schdule-content">
                <div className="content-title">
                  {lang.CHOOSE_NEW_DEVICES}
                </div>
                <div className="content-description">
                  {lang.CHOOSE_NEW_DEVICES}
                </div>
              </div>
          }
          {this.state.jobApplied ? <DeepLinkSection {...deepLinkSectionProps} /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { devices: state.flyoutReducer.devices };
};

export default connect(mapStateToProps, null)(DeviceScheduleFlyout);
