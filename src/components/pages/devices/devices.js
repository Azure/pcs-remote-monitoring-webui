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

import TagSvg from '../../../assets/icons/Tag.svg';
import ScheduleSvg from '../../../assets/icons/Schedule.svg';
import ReconfigureSvg from '../../../assets/icons/Reconfigure.svg';
import DeleteSvg from '../../../assets/icons/Trash.svg';
import AddSvg from '../../../assets/icons/Add.svg';

class DevicesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      softSelectedDeviceId: '',
      selectedDevices: []
    };

    // Define context filter buttons
    const {
      openTagFlyout,
      openDeviceScheduleFlyout,
      openReconfigureFlyout,
      openProvisionFlyout
    } = this.props;

    this.contextButtons = {
      tag: {
        svg: TagSvg,
        onClick: openTagFlyout,
        value: lang.DEVICE_DETAIL.TAG
      },
      schedule: {
        svg: ScheduleSvg,
        onClick: openDeviceScheduleFlyout,
        value: lang.SCHEDULE
      },
      reconfigure: {
        svg: ReconfigureSvg,
        onClick: openReconfigureFlyout,
        value: lang.RECONFIGURE
      },
      delete: {
        svg: DeleteSvg,
        onClick: () => alert('Oops, you can\'t delete yet'),
        value: lang.DELETE
      },
      provision: {
        svg: AddSvg,
        onClick: openProvisionFlyout,
        value: lang.DEVICES.PROVISIONDEVICES
      }
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

  renderContextFilters() {
    const pcsBtn = (props, visible = true) => visible ? <PcsBtn {...props} /> : '';
    const showActionBtns = this.state.selectedDevices.length > 0;

    return (
      <ContextFilters>
        { pcsBtn(this.contextButtons.tag, showActionBtns) }
        { pcsBtn(this.contextButtons.schedule, showActionBtns) }
        { pcsBtn(this.contextButtons.reconfigure, showActionBtns) }
        { pcsBtn(this.contextButtons.delete, showActionBtns) }
        <ManageFilterBtn />
        { pcsBtn(this.contextButtons.provision) }
      </ContextFilters>
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
        { this.renderContextFilters() }
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
    openTagFlyout: () => openFlyout('Tag'),
    openDeviceScheduleFlyout: () => openFlyout('Device Schedule'),
    openReconfigureFlyout: () => openFlyout('Reconfigure'),
    openProvisionFlyout: () => openFlyout('Provision')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
