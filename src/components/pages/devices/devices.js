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

class DevicesPage extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      softSelectedDeviceId: '',
      selectedDevices: []
    };
  }

  /** Update the selected devices state on hard select change */
  onHardSelectChange = selectedDevices => {
    this.setState({ selectedDevices });
    this.props.actions.devicesSelectionChanged(selectedDevices);
  }

  /** Open the device detail flyout on soft select */
  onSoftSelectChange = deviceData => {
    const flyoutParams = { device: deviceData, type: 'Device detail' };
    this.setState(
      { softSelectedDeviceId: getSoftSelectId(deviceData) },
      () => this.props.actions.showFlyout(flyoutParams)
    );
  }

  render() {
    const deviceGridProps = {
      /* Grid Properties */
      softSelectId: this.state.softSelectedDeviceId,
      getSoftSelectId: getSoftSelectId,
      /* Grid Events */
      onHardSelectChange: this.onHardSelectChange,
      onSoftSelectChange: this.onSoftSelectChange
    };
    
    return (
      <PageContainer>
        <TopNav breadcrumbs={lang.DEVICES_LABEL} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters>
            <AddDevice />
            <ActOnDevice ref="actOnDevice" buttonText={lang.DEVICES.ACTONDEVICES} devices={this.state.selectedDevices} /> 
            <button disabled={!this.state.selectedDevices.length} onClick={this.props.onDeviceTagClick}>{lang.DEVICE_DETAIL.TAG}</button>
        </ContextFilters>
        <PageContent>
          <DevicesGrid { ...deviceGridProps } />
        </PageContent>
      </PageContainer>
    );
  }
}

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

export default connect(null, mapDispatchToProps)(DevicesPage);
