// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as uuid from 'uuid/v4';
import Rx from 'rxjs';
import _ from 'lodash';

import lang from '../../common/lang';
import * as actions from '../../actions';

import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import Config from '../../common/config';
import {sanitizeJobName} from '../../common/utils';
import Spinner from '../spinner/spinner';
import DeepLinkSection from '../deepLinkSection/deepLinkSection';
import { getTypeOf } from '../../common/utils';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';

import './deviceReconfigureFlyout.css';

const validReportedProperties = [Config.STATUS_CODES.TYPE, Config.STATUS_CODES.LOCATION, Config.STATUS_CODES.FIRMWARE];

const getRelatedJobs = (devices, propertyUpdateJobs) => {
  if (!devices || !propertyUpdateJobs || !devices.length || !propertyUpdateJobs.length) return [];
  return propertyUpdateJobs.filter(job => devices.some(({ Id }) => job.deviceIds.indexOf(Id) !== -1));
}

class DeviceReconfigureFlyout extends React.Component {
  constructor() {
    super();
    this.inputReference = {};
    this.state = {
      commonConfiguration: [],
      jobInputValue: '',
      jobApplied: false,
      jobId: ''
    };

    this.commonConfigValueChanged = this.commonConfigValueChanged.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.applyDeviceConfigureJobsData =this.applyDeviceConfigureJobsData.bind(this);
    this.checkJobStatus = this.checkJobStatus.bind(this);
  }

  componentDidMount() {
    const { devices, propertyUpdateJobs } = this.props;
    this.checkJobStatus(devices, propertyUpdateJobs);
    this.calcCommonConfiguration(devices);
  }

  componentWillReceiveProps(nextProps) {
    const { devices, propertyUpdateJobs } = nextProps;
    if (!_.isEqual(propertyUpdateJobs, this.props.propertyUpdateJobs)) {
      this.checkJobStatus(devices, propertyUpdateJobs);
    }
    if (!_.isEqual(devices, this.props.devices)) {
      this.calcCommonConfiguration(devices);
    }
  }

  checkJobStatus (devices, propertyUpdateJobs) {
    if(!devices || !propertyUpdateJobs || !devices.length || !propertyUpdateJobs.length) return;
    const jobs = getRelatedJobs(devices, propertyUpdateJobs);
    const deviceIdSet = new Set(devices.map(({Id}) => Id));
    Rx.Observable.from(jobs)
      .flatMap(({ jobId, deviceIds }) =>
        Rx.Observable
          .fromPromise(ApiService.getJobStatus(jobId))
          // Get completed jobs
          .filter(({ status }) => status === 3)
          .do(_ => this.props.actions.removePropertyJob(jobId))
          .flatMap(_ => deviceIds)
      )
      .distinct()
      .filter(deviceId => deviceIdSet.has(deviceId))
      .flatMap(deviceId => ApiService.getDeviceById(deviceId))
      .reduce((devices, device) => [...devices, device], [])
      .subscribe(
        devices => {
          this.props.actions.updateDevicesItems(devices);
          this.props.actions.updateDevices(devices)
        },
        error => console.log('error', error)
      );
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
        const { Reported, Desired } = device.Properties;
        validReportedProperties.forEach(key => {
          if (Reported[key] !== undefined) {
            commonConfiguration.push({
              label: key,
              value: (Desired[key] && Desired[key] !== Reported[key]) ? `${Reported[key]} ${lang.SYNCING} ${Desired[key]}` : Reported[key],
              type: getTypeOf(Reported[key]),
              desired: Desired[key] ? true : false
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
        const { Reported, Desired } = device.Properties;
        validReportedProperties.forEach(reportedProp => {
          if (uncommonReportedPropValueMap[reportedProp]) return;
          if (Reported[reportedProp] !== undefined) {
            const commonValue = valuesMap[reportedProp] === Reported[reportedProp] ? valuesMap[reportedProp] : lang.MULTIPLE;
            if (valuesMap[reportedProp] !== undefined) {
              // If the values are shared across devices, show the value, if not, show 'Multiple'
              valuesMap[reportedProp] = commonValue;
            } else {
              valuesMap[reportedProp] = Reported[reportedProp];
            }
            if (Desired[reportedProp] && Reported[reportedProp] !== Desired[reportedProp]) {
              valuesMap[reportedProp] = commonValue === lang.MULTIPLE ? `${commonValue} ${lang.SYNCING}` : `${commonValue} ${lang.SYNCING} ${Desired[reportedProp]}`
            }
          }
        });
      });

      Object.keys(valuesMap).forEach(key => {
        commonConfiguration.push({
          label: key,
          value: valuesMap[key],
          type: getTypeOf(valuesMap[key]),
          desired: valuesMap[key].indexOf(lang.SYNCING) !== -1
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
    this.setState({ jobInputValue: sanitizeJobName(event.target.value || '') });
  }

  applyDeviceConfigureJobsData() {
    const { devices } = this.props;
    const deviceIds = devices.map(({ Id }) => `'${Id}'`).join(',');
    const reportedProps = {};
    this.state.commonConfiguration.forEach(item => {
      reportedProps[item.label] = item.value;
    });
    const payload = {
      JobId: this.state.jobInputValue ? this.state.jobInputValue + '-' + uuid() : uuid(),
      QueryCondition: `deviceId in [${deviceIds}]`,
      updateTwin: {
        Properties: {
          Desired: reportedProps
        }
      }
    };

    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(({ jobId }) => {
      this.props.actions.updatePropertyJobs({
        jobId,
        deviceIds: devices.map(({ Id }) => Id)
      });
      this.setState({
        showSpinner: false,
        jobApplied: true,
        jobId
      });
    });
  }

  commonReconfigure() {
    const { commonConfiguration } = this.state;
    if (!commonConfiguration || !commonConfiguration.length) {
      return (
        <div className="no-common-properties-container">
          <div className="no-common-description">
            {lang.NO_AVAILABLE_COMMON_TAGS}
          </div>
          <div className="no-common-description">
            {lang.PLEASE_CHOOSE_DEVICES_WITH_COMMON_TAGS}
          </div>
        </div>
      );
    }

    return (
      <div className="common-reconfigure-container">
        <div className="device-configuration-row name-value-type">
          <span className="device-configuration-items">
            {lang.FIELD}
          </span>
          <span className="device-configuration-items">
            {lang.VALUE}
          </span>
          <span className="device-configuration-items">
            {lang.TYPE}
          </span>
        </div>
        {commonConfiguration.map((item, idx) =>
          <div className="device-configuration-row name-value-type" key={item.label} onClick={() => {this.inputReference[idx] && this.inputReference[idx].focus()}}>
            <span className="device-configuration-items">
              {item.label}
            </span>
            {item.label !== Config.STATUS_CODES.FIRMWARE
              ? item.desired
                  ? <span className="device-configuration-items value-for-existed-data">
                      {item.value}
                    </span>
                  : <input
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
    let totalAffectedDevices = this.props.devices ? this.props.devices.length : 0;
    const disabledButton = !this.state.jobInputValue;
    const deepLinkSectionProps = {
      path: `/maintenance/job/${this.state.jobId}`,
      description: lang.VIEW_JOB_STATUS,
      linkText: lang.VIEW
    };

    return (
      <div className="device-configuration-container">
        <div className="sub-heading">
          {lang.CHOOSE_DEVICE_CONFIGURATION}
        </div>
        <div className="sub-class-heading">
          {lang.AVAILABLE_PROPERTIES}
        </div>
        <div className="job-name-container">
          <div className="label-key">
            {lang.JOB_NAME}
          </div>
          <input
            type="text"
            className="style-manage"
            placeholder={lang.RECONFIGURE_JOB}
            onChange={this.onChangeInput}
            value={this.state.jobInputValue}
          />
          <div className="jobname-reference">
            <span className="asterisk">*</span>
            {lang.JOB_NAME_REFERENCE}
          </div>
        </div>
        {this.commonReconfigure()}
        <SummarySection count={totalAffectedDevices} content={lang.AFFECTED_DEVICES} />
        <div className="btn-container">
          <PcsBtn svg={CancelX} value={lang.CANCEL} onClick={this.props.onClose} />
          {this.state.showSpinner && <Spinner size="medium" />}
          {this.state.jobApplied
            ? <PcsBtn svg={Apply} value={lang.APPLIED} disabled />
            : <PcsBtn
                className="primary"
                svg={Apply}
                value={lang.APPLY}
                disabled={disabledButton}
                onClick={this.applyDeviceConfigureJobsData}
              /> }
        </div>
        {this.state.jobApplied ? <DeepLinkSection {...deepLinkSectionProps}/> : null}
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
    deviceETags: state.flyoutReducer.deviceETags || {},
    propertyUpdateJobs: state.systemStatusJobReducer.propertyUpdateJobs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReconfigureFlyout);
