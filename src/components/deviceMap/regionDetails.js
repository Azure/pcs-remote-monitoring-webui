import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import lang from '../../common/lang';
import './regionDetails.css';
import Config from '../../common/config';

class RegionDetails extends Component {
  render() {
    const regionDetailsProps = {
      onlineDevicesCount: 0,
      offlineDevicesCount: 0,
      totalAlarmDeviceCount: 0,
      totalWarningsDeviceCount: 0
    };
    if (this.props.devices) {
      regionDetailsProps.onlineDevicesCount = this.props.devices.items.filter(item => {
        return item.Connected;
      }).length;
      regionDetailsProps.offlineDevicesCount = this.props.devices.items.filter(item => {
        return !item.Connected;
      }).length;
    }
    if (this.props.alarmList) {
      regionDetailsProps.totalAlarmDeviceCount = this.props.alarmList.filter(item => {
        return item.Rule.Severity === Config.STATUS_CODES.CRITICAL;
      }).length;
      regionDetailsProps.totalWarningsDeviceCount = this.props.alarmList.filter(item => {
        return item.Rule.Severity === Config.STATUS_CODES.WARNING;
      }).length;
    }

    let deviceGroups = this.props.filterReducer.deviceGroups || [];
    let selectedDeviceGroupId = this.props.filterReducer.selectedDeviceGroupId;
    let selectedDeviceGroupName = '';
    deviceGroups.forEach((group, idx) => {
      if (group.Id === selectedDeviceGroupId) {
        selectedDeviceGroupName = group.DisplayName;
      }
    });
    if (!selectedDeviceGroupName) {
      selectedDeviceGroupName = lang.ALLDEVICES;
    }
    return (
      <Col md={3} className="device-location-conatiner">
        <div>
          <h3>
            {selectedDeviceGroupName}
          </h3>
          <div className="device-subheading">
            {lang.DEVICES}
          </div>
          <Row className="alarm-warning-container">
            <Col md={6} className="total-alarms-container">
              <div className="total-alarms">
                {regionDetailsProps.totalAlarmDeviceCount}
              </div>
              <svg className=" total triangle">
                <polygon points="25,2.5 48.5,49.8 2.5,49.8" fill="#fc540a" />
              </svg>
              <div className="alarms">
                {lang.ALARMS}
              </div>
            </Col>
            <Col md={6} className=" total-alarms-container warnings-container">
              <div className=" total-alarms total-warnings">
                {regionDetailsProps.totalWarningsDeviceCount}
              </div>
              <svg className="triangle rectangle">
                <rect width="8" height="8" fill="#FDE870" />
              </svg>
              <div className=" total warnings">
                {lang.WARNINGS}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="total-container">
              <div className="total">
                {regionDetailsProps.onlineDevicesCount + regionDetailsProps.offlineDevicesCount}
              </div>
              <div className="warnings">
                {lang.TOTAL}
              </div>
            </Col>
            <Col md={4} className="total-container total-online-container">
              <div className="total-online">
                {regionDetailsProps.onlineDevicesCount}
              </div>
              <div className="online">
                {lang.ONLINE}
              </div>
            </Col>
            <Col md={4} className="total-container total-offline-container">
              <div className="total-offline">
                {regionDetailsProps.offlineDevicesCount}
              </div>
              <div className="offline">
                {lang.OFFLINE}
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}
const mapStateToProps = state => ({
  filterReducer: state.filterReducer
});

export default connect(mapStateToProps, null)(RegionDetails);
