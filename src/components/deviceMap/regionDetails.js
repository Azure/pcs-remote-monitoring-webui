import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import lang from '../../common/lang';
import './regionDetails.css';
import Config from '../../common/config';
import WarningSvg from '../../assets/icons/Warning.svg';
import CriticalSvg from '../../assets/icons/Critical.svg';

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
        <h3>{selectedDeviceGroupName}</h3>
        <Row className="alarm-warning-container">
          <Col md={6} className="total-alarms-container">
            <div className="total-alarms">
              {regionDetailsProps.totalAlarmDeviceCount}
            </div>
            <img src={CriticalSvg} alt={`${CriticalSvg}`} className="total triangle" />
            <div className="critical">{lang.CRITICAL}</div>
          </Col>
          <Col md={6} className="total-alarms-container warnings-container">
            <div className="total-alarms total-warnings">
              {regionDetailsProps.totalWarningsDeviceCount}
            </div>
            <img src={WarningSvg} alt={`${WarningSvg}`} className="triangle rectangle" />
            <div className="total warnings">
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
            <div className="total-connected">
              {regionDetailsProps.onlineDevicesCount}
            </div>
            <div className="connected">{lang.CONNECTED}</div>
          </Col>
          <Col md={4} className="total-container total-offline-container">
            <div className="total-offline">
              {regionDetailsProps.offlineDevicesCount}
            </div>
            <div className="offline">{lang.OFFLINE}</div>
          </Col>
        </Row>
      </Col>
    );
  }
}
const mapStateToProps = state => ({
  filterReducer: state.filterReducer
});

export default connect(mapStateToProps, null)(RegionDetails);
