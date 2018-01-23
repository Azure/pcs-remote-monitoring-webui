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
import './devices.css';

class DevicesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      softSelectedDeviceId: '',
      lastRefreshed: new Date(),
      rowData: this.filterDevices(this.props.devices),
      contextBtns: ''
    };
    this.refreshData = this.refreshData.bind(this);
  }

  refreshData() {
    this.setState({ lastRefreshed: new Date(), rowData: undefined }, () => { this.props.actions.loadDevices(true); });
  }

  componentWillReceiveProps(nextProps) { this.setState({ rowData: this.filterDevices(nextProps.devices) }); }

  componentDidMount() { this.props.actions.showingDevicesPage(); }

  componentWillUnmount() { this.props.actions.notShowingDevicesPage(); }

  /** Open the device detail flyout on soft select */
  onSoftSelectChange = device => {
    this.setState(
      { softSelectedDeviceId: getSoftSelectId(device) },
      ()=> this.props.actions.showFlyout({ device, type: 'Device detail' })
    );
  };

  /** Listen for changes in the dynamic context filters and update accordingly */
  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  filterDevices(devices) {
    if (!devices || !devices.Items) return devices;
    const status = (this.props.params || {}).status || '';
    const isConnected = status.toLowerCase() === 'connected';
    return {
      Items: devices.Items.filter((device) => {
        if (!status) return true;
        return device.Connected === isConnected;
      })
    };
  }

  render() {
    // Extract the devices from the props
    const devices = (this.state.rowData || {}).Items;

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
          <PcsBtn svg={AddSvg} onClick={this.props.openProvisionFlyout} value={lang.NEW_DEVICE} />
        </ContextFilters>
        <PageContent className="devices-grid-container">
          <div className="timerange-selection">
            <span className="last-refreshed-text">{`${lang.LAST_REFRESHED} | `}</span>
            <div className="last-refreshed-time">
              {this.state.lastRefreshed.toLocaleString()}
            </div>
            <div onClick={this.refreshData} className="refresh-icon icon-sm" />
          </div>
          { devices && devices.length === 0 ? <div className="no-results">{lang.NO_RESULTS_FOUND}</div> :  <DevicesGrid {...deviceGridProps}/> }
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
  };

  return {
    actions: bindActionCreators(actions, dispatch),
    openProvisionFlyout: () => openFlyout('New device')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
