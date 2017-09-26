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
import PcsBtn from '../../shared/pcsBtn/pcsBtn';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';
import SimControlCenter from '../../simControlCenter/simControlCenter';

import AddSvg from '../../../assets/icons/Add.svg';

class DevicesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      softSelectedDeviceId: '',
      contextBtns: ''
    };
  }

  /** Open the device detail flyout on soft select */
  onSoftSelectChange = device => {
    this.setState(
      { softSelectedDeviceId: getSoftSelectId(device) },
      () => this.props.actions.showFlyout({ device, type: 'Device detail' })
    );
  }

  /** Listen for changes in the dynamic context filters and update accordingly */
  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    // Extract the devices from the props
    const rawDevices = this.props.devices || {};
    const devices = rawDevices.items || [];

    // Create the device grid props
    const deviceGridProps = {
      /* Grid Properties */
      rowData: devices,
      softSelectId: this.state.softSelectedDeviceId,
      getSoftSelectId: getSoftSelectId,
      /* Grid Events */
      onSoftSelectChange: this.onSoftSelectChange,
      onContextMenuChange: this.onContextMenuChange
    };

    return (
      <PageContainer>
        <TopNav breadcrumbs={lang.DEVICES} projectName={lang.AZUREPROJECTNAME} />
        <ContextFilters>
          {this.state.contextBtns}
          <SimControlCenter />
          <ManageFilterBtn />
          <PcsBtn svg={AddSvg} 
                  onClick={this.props.openProvisionFlyout} 
                  value={lang.PROVISIONDEVICES} />
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
  // A helper method for opening the flyout
  const openFlyout = (type, callback) => {
    dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: { type, callback }
    });
  }

  return {
    actions: bindActionCreators(actions, dispatch),
    openProvisionFlyout: () => openFlyout('Provision')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
