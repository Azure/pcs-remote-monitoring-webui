// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../../common/lang';
import * as actions from '../../actions';
import './deviceTagFlyout.css';
import Trash from '../../assets/icons/Trash.svg';
import Add from '../../assets/icons/Add.svg';
import Select from 'react-select';
import Rx from 'rxjs';
import * as uuid from 'uuid/v4';
import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import Config from '../../common/config';
import Spinner from '../spinner/spinner';
import _ from 'lodash';

const isNumeric = value => typeof value === 'number' || !isNaN(parseInt(value, 10));
const isBoolean = value =>
  value !== null && (typeof value === 'boolean' || value.toLowerCase() === 'Y' || value.toLowerCase() === 'n');

const typeOptions = [
  {
    value: 'int',
    label: Config.STATUS_CODES.INT
  },
  {
    value: 'string',
    label: Config.STATUS_CODES.STRING
  },
  {
    value: 'boolean',
    label: Config.STATUS_CODES.BOOLEAN
  }
];

class DeviceTagFlyout extends React.Component {
  constructor() {
    super();
    this.inputReferences = {};
    this.state = {
      commonTags: [],
      deletedTagNames: [],
      overiddenDeviceTagValues: {
        //key will be device Id and value will be tag name/value map
      },
      newTags: [], //{name, value, type}
      commonTagValues: {},
      commonTagTypes: [],
      showCreateFilter: false
    };
    this.addNewTag = this.addNewTag.bind(this);
    this.deleteExistingTag = this.deleteExistingTag.bind(this);
    this.deleteNewTag = this.deleteNewTag.bind(this);
    this.commonTagValueChanged = this.commonTagValueChanged.bind(this);
  }

  componentWillMount() {
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
        devices.every(device => !!mergeTags(device.Tags, overiddenDeviceTagValues[device.Id])[tagName])
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
            newState.commonTagTypes[tagName] = 'Int';
          } else if (values.every(isBoolean)) {
            newState.commonTagTypes[tagName] = 'Boolean';
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
    if (!_.isEqual(nextProps.devices, this.props.devices)) {
      this.computeState(nextProps, 'componentWillReceiveProps');
    }
  }

  commonTagValueChanged(tagName, evt) {
    console.log(tagName, evt);
    const { devices } = this.props;
    const devicesToBeUpdated = devices.filter(device => {
      return device.Tags && typeof device.Tags[tagName] !== 'undefined';
    });
    this.saveChangedTagValues(devicesToBeUpdated, tagName, evt.target.value);
  }

  applyChangedData() {
    const { newTags, overiddenDeviceTagValues, deletedTagNames } = this.state;
    const { deviceETags } = this.props;
    newTags.forEach(tag => {
      this.props.devices.forEach(device => {
        overiddenDeviceTagValues[device.Id] = {
          ...overiddenDeviceTagValues[device.Id],
          [tag.name]: tag.value
        };
      });
    });

    deletedTagNames.forEach(tagName => {
      this.props.devices.forEach(device => {
        let overiddenMap = overiddenDeviceTagValues[device.Id]
          ? overiddenDeviceTagValues[device.Id]
          : (overiddenDeviceTagValues[device.Id] = {});
        overiddenMap[tagName] = null;
      });
    });

    this.setState({ newTags: [], overiddenDeviceTagValues }, () => this.computeState(this.props, 'applyChangedData'));
    const devices = _.cloneDeep(this.props.devices);
    devices.forEach(device => (device.Etag = deviceETags[device.Id] ? deviceETags[device.Id] : device.Etag));
    this.props.actions.deviceListCommonTagsValueChanged(devices, overiddenDeviceTagValues);
    this.applyDeviceTagJobsData();
  }

  saveChangedTagValues(devices, tagName, value) {
    const overiddenDeviceTagValues = this.state.overiddenDeviceTagValues;
    devices.forEach(device => {
      const tagNameValue = overiddenDeviceTagValues[device.Id] || (overiddenDeviceTagValues[device.Id] = {});
      tagNameValue[tagName] = value;
    });
    this.setState({ overiddenDeviceTagValues }, () => this.computeState(this.props, 'saveChangedTagValues'));
  }

  deleteNewTag(idx) {
    let { newTags } = this.state;
    newTags.splice(idx, 1);
    this.setState({
      newTags: newTags
    });
  }

  applyDeviceTagJobsData() {
    const x = { ...this.state.commonTagValues };
    this.state.newTags.forEach(tag => {
      x[tag.name] = tag.value;
    });
    const { devices } = this.props;
    const ids = devices.map(device => device.Id);
    const payload = {
      JobId: uuid(),
      QueryCondition: `deviceId in [${ids.toString()}]`,
      MaxExecutionTimeInSeconds: 0,
      updateTwin: {
        tags: x
      }
    };
    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(data => {
      this.setState({ showSpinner: false });
    });
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
                placeholder={lang.DEVICE_DETAIL.NAME}
              />
              <input
                type="text"
                className="condition-value"
                value={tag.value}
                onChange={evt => this.setTagProperty(tag, 'value', evt.target.value)}
                placeholder={lang.DEVICE_DETAIL.VALUE}
              />
              <span className="device-tag-type">
                <Select
                  autofocus
                  options={typeOptions}
                  value={tag.type}
                  simpleValue
                  onChange={val => this.setTagProperty(tag, 'type', val)}
                  searchable={true}
                  placeholder={lang.FILTER.TYPE}
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
        {commonTags.filter(tagName => deletedTagNames.indexOf(tagName) === -1).map((tagName, idx) => {
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
      deletedTagNames: [...this.state.deletedTagNames, tagName]
    });
  }

  addNewTag() {
    this.setState({
      newTags: [{ name: '', value: '', type: 'String' }, ...this.state.newTags]
    });
  }

  render() {
    let totalEffectedDevices = this.props.devices ? this.props.devices.length : 0;
    const { commonTags } = this.state;

    return (
      <div className="device-tag-flyout-container">
        <div className="sub-heading">
          {lang.DEVICE_DETAIL.TAGS_ON_SELECTED_DEVICES}
        </div>
        <div className="sub-class-heading">
          {lang.DEVICE_DETAIL.TAGS_IN_COMMON_SELECTED_DEVICE}
        </div>
        <div className="job-name-container">
          <label>
            <div className="label-key">
              {lang.DEVICE_DETAIL.JOB_NAME}
            </div>
            <input type="text" className="style-manage" placeholder={lang.DEVICE_DETAIL.ADJUST_TAGS} />
          </label>
        </div>
        <div className="device-conditions-container">
          <span className="device-condition">
            {lang.DEVICE_DETAIL.NAME}
          </span>
          <span className="device-condition">
            {lang.DEVICE_DETAIL.VALUE}
          </span>
          <span className="device-condition">
            {lang.DEVICE_DETAIL.TYPE}
          </span>
        </div>
        <div className="device-tag-inner-conditions">
          <div className="add-icon-name-container" onClick={this.addNewTag}>
            <img src={Add} alt={`${Add}`} className="add-icon" />
            <span className="add-device-tag">
              {lang.DEVICE_DETAIL.ADD_TAG}
            </span>
          </div>

          {this.renderNewTags()}
        </div>
        {commonTags.length
          ? this.renderCommonTags()
          : <div>
              <div className="no-common-tags">
                {lang.DEVICES.NO_AVAILABLE_COMMON_TAGS}
              </div>
              <div className="no-common-tags-sub-class">
                {lang.DEVICES.PLEASE_CHOOSE_DEVICES_WITH_COMMON_TAGS}
              </div>
            </div>}

        <div className="summary-container">
          {lang.DEVICE_DETAIL.SUMMARY}
        </div>
        <div className="effective-devices">
          <span className="no-effected-devices">
            {totalEffectedDevices}
          </span>
          <span className="effected-devices-name">
            {lang.DEVICES.EFFECTED_DEVICES}
          </span>
        </div>
        <div className="button-container">
          <button
            onClick={() => {
              this.setState({ showCreateFilter: false });
            }}
            className="pcs-btn"
          >
            <img src={CancelX} alt={`${CancelX}`} className="cancel-icon" />
            {lang.FILTER.CANCEL}
          </button>
          {this.props.requestInProgress
            ? <span className="loading-spinner">
                <Spinner />
              </span>
            : null}
          <button
            className="pcs-btn primary"
            onClick={() => {
              this.applyChangedData();
            }}
          >
            <img src={Apply} alt={`${Apply}`} className="apply-icon" />
            {lang.DEVICE_DETAIL.APPLY}
          </button>
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

const mapStateToProps = (state, ownProps) => {
  return {
    devices: state.flyoutReducer.devices,
    deviceETags: state.flyoutReducer.deviceETags || {},
    overiddenDeviceTagValues: state.flyoutReducer.overiddenDeviceTagValues,
    requestInProgress: state.flyoutReducer.requestInProgress
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceTagFlyout);
