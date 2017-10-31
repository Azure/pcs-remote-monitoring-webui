// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import lang from '../../common/lang';
import * as actions from '../../actions';
import Trash from '../../assets/icons/Trash.svg';
import Add from '../../assets/icons/Add.svg';
import Select from 'react-select';
import Rx from 'rxjs';
import * as uuid from 'uuid/v4';
import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import Config from '../../common/config';
import {sanitizeJobName} from '../../common/utils';
import Spinner from '../spinner/spinner';
import DeepLinkSection from '../deepLinkSection/deepLinkSection';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';

import './deviceTagFlyout.css';

const isNumeric = value => typeof value === 'number' || !isNaN(parseInt(value, 10));

const getRelatedJobs = (devices, twinUpdateJobs) => {
  if (!devices || !twinUpdateJobs || !devices.length || !twinUpdateJobs.length) return [];
  return twinUpdateJobs.filter(job => devices.some(({ Id }) => job.deviceIds.indexOf(Id) !== -1));
}

const typeOptions = [
  {
    value: 'Number',
    label: lang.NUMBER
  },
  {
    value: 'String',
    label: lang.STRING
  }
];

class DeviceTagFlyout extends React.Component {
  constructor() {
    super();
    this.inputReferences = {};
    this.state = {
      commonTags: [],
      deletedTagNames: {},
      jobInputValue: '',
      overiddenDeviceTagValues: {
        //key will be device Id and value will be tag name/value map
      },
      newTags: [], //{name, value, type}
      commonTagValues: {},
      commonTagTypes: [],
      showCreateFilter: false,
      jobApplied: false,
      jobId: ''
    };
    this.addNewTag = this.addNewTag.bind(this);
    this.deleteExistingTag = this.deleteExistingTag.bind(this);
    this.deleteNewTag = this.deleteNewTag.bind(this);
    this.commonTagValueChanged = this.commonTagValueChanged.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.applyDeviceTagJobsData = this.applyDeviceTagJobsData.bind(this);
    this.checkJobStatus = this.checkJobStatus.bind(this);
  }

  componentDidMount() {
    const { devices, twinUpdateJobs } = this.props;
    this.checkJobStatus(devices, twinUpdateJobs);
    if (this.props.overiddenDeviceTagValues) {
      this.setState({ overiddenDeviceTagValues: this.props.overiddenDeviceTagValues });
    }
    this.computeState(this.props);
  }

  computeState(nextProps) {
    const { devices } = nextProps;
    const { overiddenDeviceTagValues } = this.state;

    /**
     * A helper method to merge two tag objects
     */
    const mergeTags = (existingTags, overriddenTags) => {
      return {
        ...(existingTags || {}),
        ...(overriddenTags || {})
      };
    };

    // Create a stream of devices
    const deviceStream = Rx.Observable.of(devices).flatMap(_ => _);
    deviceStream
      // Convert the device stream into a stream of tab names
      .flatMap(device => Object.keys(mergeTags(device.Tags, overiddenDeviceTagValues[device.Id])))
      // Remove duplicate tag names from the stream
      .distinct()
      // Extract only the common tag names
      .filter(tagName =>
        devices.every(device => (typeof (mergeTags(device.Tags, overiddenDeviceTagValues[device.Id])[tagName]) !== 'undefined'))
      )
      // Compute the tag values for each tag name into a map
      .flatMap(tagName =>
        deviceStream
          .map(device => {
            // Explicitly check undefined because empty string is valid
            return mergeTags(device.Tags, overiddenDeviceTagValues[device.Id])[tagName];
          })
          .distinct()
          .filter(value => value !== undefined)
          .reduce((acc, curr) => [...acc, curr], [])
          .map(values => ({ tagName: tagName, values: values }))
      )
      // Construct the new component state
      .reduce(
        (newState, { tagName, values }) => {
          newState.commonTags.push(tagName);
          newState.commonTagValues[tagName] = values.length === 1 ? values[0] : 'Multiple';
          if (values.every(isNumeric)) {
            newState.commonTagTypes[tagName] = 'Number';
          } else {
            newState.commonTagTypes[tagName] = 'String';
          }
          return newState;
        },
        { commonTags: [], commonTagValues: {}, commonTagTypes: {} }
      )
      // Update the component state
      .subscribe(newState => {
        this.setState({ ...newState }, () => {});
      });
  }

  componentWillReceiveProps(nextProps) {
    const { devices, twinUpdateJobs } = nextProps;
    if (!_.isEqual(devices, this.props.devices)) {
      this.setState(
        { jobApplied: false },
        () => this.computeState(nextProps)
      );
    }
    if (!_.isEqual(twinUpdateJobs, this.props.twinUpdateJobs)) {
      this.checkJobStatus(devices, twinUpdateJobs);
    }
  }

  checkJobStatus (devices, twinUpdateJobs) {
    if(!devices || !twinUpdateJobs || !devices.length || !twinUpdateJobs.length) return;
    const jobs = getRelatedJobs(devices, twinUpdateJobs);
    const deviceIdSet = new Set(devices.map(({Id}) => Id));
    Rx.Observable.from(jobs)
      .flatMap(({ jobId, deviceIds }) =>
        Rx.Observable
          .fromPromise(ApiService.getJobStatus(jobId))
          // Get completed jobs
          .filter(({ status }) => status === 3)
          .do(_ => this.props.actions.removeTwinJob(jobId))
          .flatMap(_ => deviceIds)
      )
      .distinct()
      .filter(deviceId => deviceIdSet.has(deviceId))
      .flatMap(deviceId => ApiService.getDeviceById(deviceId))
      .reduce((devices, device) => [...devices, device], [])
      .subscribe(
        devices => {
          this.props.actions.updateDevicesItems(devices);
          this.props.actions.updateDevices(devices);
        },
        error => console.log('error', error)
      );
  }

  commonTagValueChanged(tagName, evt) {
    const { devices } = this.props;
    const devicesToBeUpdated = devices.filter(device => {
      return device.Tags && typeof device.Tags[tagName] !== 'undefined';
    });
    this.saveChangedTagValues(devicesToBeUpdated, tagName, evt.target.value);
  }

  applyChangedData() {
    const { newTags, overiddenDeviceTagValues } = this.state;
    const { deviceETags } = this.props;
    newTags.forEach(tag => {
      this.props.devices.forEach(device => {
        overiddenDeviceTagValues[device.Id] = {
          ...overiddenDeviceTagValues[device.Id],
          [tag.name]: tag.value
        };
      });
    });

    this.setState({ newTags: [], overiddenDeviceTagValues }, () => this.computeState(this.props));
    const devices = _.cloneDeep(this.props.devices);
    devices.forEach(device => (device.Etag = deviceETags[device.Id] ? deviceETags[device.Id] : device.Etag));
    this.props.actions.deviceListCommonTagsValueChanged(devices, overiddenDeviceTagValues);
  }

  saveChangedTagValues(devices, tagName, value) {
    const overiddenDeviceTagValues = this.state.overiddenDeviceTagValues;
    devices.forEach(device => {
      const tagNameValue = overiddenDeviceTagValues[device.Id] || (overiddenDeviceTagValues[device.Id] = {});
      tagNameValue[tagName] = value;
    });
    this.setState({ overiddenDeviceTagValues }, () => this.computeState(this.props));
  }

  deleteNewTag(idx) {
    let { newTags } = this.state;
    newTags.splice(idx, 1);
    this.setState({
      newTags: newTags
    });
  }

  onChangeInput(event) {
    this.setState({ jobInputValue: sanitizeJobName(event.target.value || '') });
  }

  applyDeviceTagJobsData() {
    const { devices } = this.props;
    const { newTags, deletedTagNames, commonTagValues } = this.state;
    const deviceIds = devices.map(({ Id }) => `'${Id}'`).join(',');
    const tags = {
      ...commonTagValues,
      ...deletedTagNames,
    };

    newTags.forEach(tag => {
      tags[tag.name] = tag.value;
    });
    const payload = {
      JobId: this.state.jobInputValue ? this.state.jobInputValue + '-' + uuid(): uuid(),
      QueryCondition: `deviceId in [${deviceIds}]`,
      MaxExecutionTimeInSeconds: 0,
      updateTwin: {
        tags
      }
    };
    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(({ jobId }) => {
        this.props.actions.updateTwinJobs({
          jobId,
          deviceIds : devices.map(({ Id }) => Id)
        });
        this.setState({
          showSpinner: false,
          jobApplied: true,
          jobId
        })
      }
    );
  }

  setTagProperty(tag, property, value) {
    tag[property] = value;
    this.setState({});
  }

  renderNewTags() {
    const { newTags } = this.state;
    return (
      <div>
        {newTags.map((tag, idx) =>
          <div key={idx}>
            <div className="all-conditions">
              <input
                type="text"
                className="condition-name"
                value={tag.name}
                onChange={evt => this.setTagProperty(tag, 'name', evt.target.value)}
                placeholder={lang.NAME}
              />
              <input
                type="text"
                className="condition-value"
                value={tag.value}
                onChange={evt => this.setTagProperty(tag, 'value', evt.target.value)}
                placeholder={lang.VALUE}
              />
              <span className="device-tag-type">
                <Select
                  autofocus
                  options={typeOptions}
                  value={tag.type}
                  simpleValue
                  onChange={val => this.setTagProperty(tag, 'type', val)}
                  searchable={true}
                  placeholder={lang.TYPE}
                  className="select-style-manage"
                />
              </span>
              <span>
                <img src={Trash} onClick={() => this.deleteNewTag(idx)} alt={`${Trash}`} className="delete-icon" />
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderCommonTags() {
    const { commonTags, commonTagValues, commonTagTypes, deletedTagNames } = this.state;
    return (
      <div className="common-tags">
        {commonTags.filter(tagName => !(tagName in deletedTagNames)).map((tagName, idx) => {
          return (
            <div className="device-tag-items name-value-type" key={tagName} onClick={() => {this.inputReferences[idx] && this.inputReferences[idx].focus()}}>
              <span className="device-tag">
                {tagName}
              </span>
              {tagName !== Config.STATUS_CODES.FIRMWARE
                ? <input
                    type="text"
                    className="device-tag value-for-existed-data"
                    onChange={evt => this.commonTagValueChanged(tagName, evt)}
                    value={commonTagValues[tagName]}
                    ref={(ip) => this.inputReferences[idx] = ip}
                  />
                : <span>
                    {commonTagValues[tagName]}
                  </span>}
              <span className="device-tag value-for-existed-data">
                {commonTagTypes[tagName]}
              </span>
              <span className="device-tag trash-icon-for-existed-data">
                <img
                  src={Trash}
                  onClick={() => this.deleteExistingTag(tagName)}
                  alt={`${Trash}`}
                  className="delete-icon"
                />
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  deleteExistingTag(tagName) {
    this.setState({
      deletedTagNames: {
        ...this.state.deletedTagNames,
        [tagName]: null
      }
    });
  }

  addNewTag() {
    this.setState({
      newTags: [{ name: '', value: '', type: 'String' }, ...this.state.newTags]
    });
  }

  render() {
    const deepLinkSectionProps = {
      path: `/maintenance/job/${this.state.jobId}`,
      description: lang.VIEW_JOB_STATUS,
      linkText: lang.VIEW
    };
    const disabledButton = !this.state.jobInputValue;
    let totalAffectedDevices = this.props.devices ? this.props.devices.length : 0;
    const { commonTags } = this.state;
    return (
      <div className="device-tag-flyout-container">
        <div className="sub-heading">
          {lang.TAGS_ON_SELECTED_DEVICES}
        </div>
        <div className="sub-class-heading">
          {lang.TAGS_IN_COMMON_SELECTED_DEVICE}
        </div>
        <div className="job-name-container">
          <label>
            <div className="label-key">
              {lang.JOB_NAME}
            </div>
            <input type="text" className="style-manage" placeholder={lang.ADJUST_TAGS} onChange={this.onChangeInput}
            value={this.state.jobInputValue}/>
            <div className="jobname-reference">
              <span className="asterisk">*</span>
              {lang.JOB_NAME_REFERENCE}
            </div>
          </label>
        </div>
        <div className="device-conditions-container">
          <span className="device-condition">
            {lang.NAME}
          </span>
          <span className="device-condition">
            {lang.VALUE}
          </span>
          <span className="device-condition">
            {lang.TYPE}
          </span>
        </div>
        <div className="device-tag-inner-conditions">
          <div className="add-icon-name-container" onClick={this.addNewTag}>
            <img src={Add} alt={`${Add}`} className="add-icon" />
            <span className="add-device-tag">
              {lang.ADD_TAG}
            </span>
          </div>

          {this.renderNewTags()}
        </div>
        {commonTags.length
          ? this.renderCommonTags()
          : <div>
              <div className="no-common-tags">
                {lang.NO_AVAILABLE_COMMON_TAGS}
              </div>
              <div className="no-common-tags-sub-class">
                {lang.PLEASE_CHOOSE_DEVICES_WITH_COMMON_TAGS}
              </div>
            </div>}

        <SummarySection count={totalAffectedDevices} content={lang.AFFECTED_DEVICES} />
        <div className="button-container">
          <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CANCEL}</PcsBtn>
          {this.state.showSpinner && <Spinner size="medium" />}
          {this.state.jobApplied
            ? <PcsBtn svg={Apply} value={lang.APPLIED} disabled />
            : <PcsBtn
                className="primary"
                svg={Apply}
                value={lang.APPLY}
                disabled={disabledButton}
                onClick={this.applyDeviceTagJobsData}/> }
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

const mapStateToProps = (state, ownProps) => {
  return {
    devices: state.flyoutReducer.devices,
    deviceETags: state.flyoutReducer.deviceETags || {},
    overiddenDeviceTagValues: state.flyoutReducer.overiddenDeviceTagValues,
    requestInProgress: state.flyoutReducer.requestInProgress,
    twinUpdateJobs: state.systemStatusJobReducer.twinUpdateJobs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceTagFlyout);
