// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';
import Spinner from '../spinner/spinner';
import Delete from '../../assets/icons/Delete_dark.svg';
import CancelX from '../../assets/icons/CancelX.svg';
import TooltipSvg from '../../assets/icons/Tooltip.svg';
import ApiService from '../../common/apiService';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';

import './deviceDeletionFlyout.css';

class DeviceDeletionFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpinner: false,
      deviceDeleted: false
    };

    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { devices } = nextProps;
    if (devices.length !== this.props.devices.length) {
      this.setState({
        showSpinner: false,
        deviceDeleted: false
      });
    }
  }

  onConfirm(physicalDevices) {
    this.setState({ showSpinner: true });
    Promise.all(
      physicalDevices.map(({ Id }) => ApiService.deleteDevice(Id))
    ).then((res) => {
      this.props.actions.updateDevicesList(physicalDevices);
      this.setState({
        showSpinner: false,
        deviceDeleted: true
      });
    });
  }

  render() {
    const { devices } = this.props;
    const physicalDevices = devices.filter(({ IsSimulated }) => !IsSimulated);
    const IsSimulated = devices.length !== physicalDevices.length;
    return (
      <div className="device-deletion-flyout">
        <div className="device-deletion-content">
          <div className="content-title">
            {lang.DELETE_DEVICE}
          </div>
          <div className="content-description">
            {IsSimulated ? lang.NOT_ABLE_TO_DELETE : lang.DELETE_DEVICE_DESCRIPTION}
          </div>

          { IsSimulated &&
            <div className="simulated-device-info">
              <img className="pcs-tooltip-icon" src={TooltipSvg} alt="Tooltip icon" />
              {lang.NOT_ABLE_TO_DELETE}
            </div>
          }

          <SummarySection
            count={physicalDevices.length}
            content={this.state.deviceDeleted ? lang.DEVICE_DELETED : lang.AFFECTED_DEVICES} />

          { this.state.deviceDeleted
            ? <div className="btn-group">
                <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CLOSE}</PcsBtn>
              </div>
            : <div className="btn-group">
                <PcsBtn svg={CancelX} onClick={this.props.onClose}>{lang.CANCEL}</PcsBtn>
                {this.state.showSpinner && <Spinner size="medium" />}
                <PcsBtn
                  disabled={physicalDevices.length === 0}
                  svg={Delete}
                  className="primary"
                  onClick={() => this.onConfirm(physicalDevices)}>
                  {lang.DELETE}
                </PcsBtn>
              </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { devices: state.flyoutReducer.devices };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDeletionFlyout);
