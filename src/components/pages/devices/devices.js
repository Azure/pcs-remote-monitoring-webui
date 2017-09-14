// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../../actions';
import * as actionTypes from '../../../actions/actionTypes';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import DevicesGrid from '../../devicesGrid/devicesGrid';
import { getSoftSelectId } from '../../devicesGrid/devicesConfig';
import lang from '../../../common/lang';
import ActOnDevice from '../../actOnDevice/actOnDevice';
import AddDevice from '../../addDevice/addDevice';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';

import ApplySvg from '../../../assets/icons/Apply.svg';

class DevicesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      softSelectedDeviceId: '',
      selectedDevices: []
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDevicesByTelemetryMessages();
  }

  /** Update the selected devices state on hard select change */
  onHardSelectChange = selectedDevices => {
    this.setState({ selectedDevices });
    this.props.actions.devicesSelectionChanged(selectedDevices);
  }

  /** Open the device detail flyout on soft select */
  onSoftSelectChange = deviceData => {
    this.setState(
      { softSelectedDeviceId: getSoftSelectId(deviceData) },
      () => this.props.actions.showFlyout({ device: deviceData, type: 'Device detail' })
    );
  }

  render() {
    // Extract the devices from the props
    const devicesProps = this.props.devices || {};
    const devices = devicesProps.items || [];

    // Create the device grid props
    const deviceGridProps = {
      /* Grid Properties */
      rowData: devices,
      softSelectId: this.state.softSelectedDeviceId,
      getSoftSelectId: getSoftSelectId,
      /* Grid Events */
      onSoftSelectChange: this.onSoftSelectChange,
      onHardSelectChange: this.onHardSelectChange
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={lang.DEVICES_LABEL} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters>
          <ActOnDevice ref="actOnDevice" buttonText={lang.DEVICES.ACTONDEVICES} devices={this.state.selectedDevices} />
          <AddDevice />
          <PcsBtn
            svg={ApplySvg}
            disabled={!this.state.selectedDevices.length}
            onClick={this.props.onDeviceTagClick}
            value={lang.DEVICE_DETAIL.TAG} />
        </ContextFilters>
        <PageContent>
          <DevicesGrid { ...deviceGridProps } />
        </PageContent>
      </PageContainer>
    );
  }
}

const mapStateToProps = state => {
  return { devices: state.deviceReducer.devices };
};

// Connect to Redux store
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
    onDeviceTagClick: () => {
      dispatch({
        type: actionTypes.FLYOUT_SHOW,
        content: { type: 'Tag' }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
