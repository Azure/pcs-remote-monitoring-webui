// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PcsGrid from '../pcsGrid/pcsGrid';
import * as actions from '../../actions';
import * as actionTypes from '../../actions/actionTypes';
import { checkboxParams, deviceColumnDefs, defaultDeviceGridProps } from './devicesConfig';
import { isFunction } from '../../common/utils';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';

import TagSvg from '../../assets/icons/Tag.svg';
import ScheduleSvg from '../../assets/icons/Schedule.svg';
import ReconfigureSvg from '../../assets/icons/Reconfigure.svg';
import DeleteSvg from '../../assets/icons/Trash.svg';

import './devicesGrid.css';

/** A helper method for creating PcsBtns */
const pcsBtn = (props, key=0) => {
  const btnProps = {...props, key};
  return <PcsBtn {...btnProps} />;
};

/**
 * A grid for displaying devices
 *
 * Encapsulates the PcsGrid props
 */
class DevicesGrid extends Component {
  constructor(props) {
    super(props);

    // Default device grid columns
    this.columnDefs = [
      { ...deviceColumnDefs.id, ...checkboxParams },
      deviceColumnDefs.isSimulated,
      deviceColumnDefs.deviceType,
      deviceColumnDefs.firmware,
      deviceColumnDefs.telemetry,
      deviceColumnDefs.status,
      deviceColumnDefs.lastConnection
    ];

    // Define context filter buttons
    const {
      openTagFlyout,
      openDeviceScheduleFlyout,
      openReconfigureFlyout
    } = this.props.contextActions;

    this.contextBtns = [
      {
        svg: TagSvg,
        onClick: openTagFlyout,
        value: lang.TAG
      },
      {
        svg: ScheduleSvg,
        onClick: openDeviceScheduleFlyout,
        value: lang.SCHEDULE
      },
      {
        svg: ReconfigureSvg,
        onClick: openReconfigureFlyout,
        value: lang.RECONFIGURE
      },
      {
        svg: DeleteSvg,
        onClick: () => alert('Oops, you can\'t delete yet'),
        value: lang.DELETE
      }
    ].map(pcsBtn);
  }

  componentWillReceiveProps(nextProps) {
    const { hardSelectedDevices } = nextProps;
    if (!hardSelectedDevices ) return;
    const deviceIdSet = new Set((hardSelectedDevices || []).map(({ Id }) => Id));

    this.deviceGridApi.forEachNode(node => {
      if (deviceIdSet.has(node.data.Id) && !node.selected) {
        node.setSelected(true);
      }
    });
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    this.deviceGridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  /**
   * Handles context filter changes and calls any hard select props method
   *
   * @param {Array} selectedDevices A list of currently selected devices
   */
  onHardSelectChange = (selectedDevices) => {
    const { contextActions, onContextMenuChange, onHardSelectChange} = this.props;
    if (isFunction(onContextMenuChange)) {
      contextActions.actions.devicesSelectionChanged(selectedDevices);
      onContextMenuChange(selectedDevices.length > 0 ? this.contextBtns : '');
    }
    if (isFunction(onHardSelectChange)) {
      onHardSelectChange(selectedDevices);
    }
  }

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultDeviceGridProps,
      columnDefs: this.columnDefs,
      onRowDoubleClicked: ({ node }) => node.setSelected(!node.isSelected()),
      ...this.props, // Allow default property overrides
      /* Grid Events */
      onHardSelectChange: this.onHardSelectChange,
      onGridReady: this.onGridReady
    };
    delete gridProps.contextActions;
    return (
      <PcsGrid {...gridProps} />
    );
  }
}

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
    contextActions: {
      actions: bindActionCreators(actions, dispatch),
      openTagFlyout: () => openFlyout('Tag'),
      openDeviceScheduleFlyout: () => openFlyout('Device Schedule'),
      openReconfigureFlyout: () => openFlyout('Reconfigure')
    }
  };
};

const mapStateToProps = (state) => {
  return {
    hardSelectedDevices: state.flyoutReducer.devices
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesGrid);
