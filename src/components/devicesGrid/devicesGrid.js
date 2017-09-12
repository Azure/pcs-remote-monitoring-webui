// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rx from 'rxjs';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import lang from '../../common/lang';
import iotHubManagerService from '../../services/iotHubManagerService';
import * as actions from '../../actions';
import PcsGrid from '../pcsGrid/pcsGrid';

import './devicesGrid.css';

const EMPTY_FIELD = '---';

export class DevicesGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnHeaders: [
        { 
          headerName: lang.DEVICES.DEVICENAME, 
          field: 'Id', 
          headerCheckboxSelection: true, 
          headerCheckboxSelectionFilteredOnly: true, 
          checkboxSelection: true
        },
        { 
          headerName: lang.DEVICE_DETAIL.SIMULATED, 
          field: 'IsSimulated', 
          valueFormatter: ({ value }) => value ? lang.DEVICES.YES: lang.DEVICES.NO
        },
        { 
          headerName: lang.DEVICES.DEVICETYPE, 
          field: 'Tags.deviceType', 
          valueFormatter: ({ value }) => value || EMPTY_FIELD
        },
        { 
          headerName: lang.DEVICE_DETAIL.FIRMWARE, 
          field: 'Properties.Reported.Firmware', 
          valueFormatter: ({ value }) => value || EMPTY_FIELD
        },
        { 
          headerName: lang.DEVICE_DETAIL.TELEMETRY, 
          field: 'Properties.Reported.Telemetry', 
          valueFormatter: ({ value }) => Object.keys(value || {}).join('; ') || EMPTY_FIELD
        },
        { 
          headerName: lang.DEVICE_DETAIL.STATUS, 
          field: 'Connected', 
          valueFormatter: ({ value }) => value ? lang.DEVICES.CONNECTED : lang.DEVICES.DISCONNECTED
        },
        { 
          headerName: lang.DEVICES.LASTCONNECTION, 
          field: 'LastActivity', 
          valueFormatter: ({ value }) => {
            const time = moment(value);
            return (time.unix() < 0) ? EMPTY_FIELD : time.format("hh:mm:ss MM.DD.YYYY");
          }
        }
      ],
      devices: [],
      selectedDevices: [],
      softSelectedDeviceId: ''
    };
  }

  /** Initialize the devices when the component loads */
  componentDidMount() {
    this.loadDevices();
  }

  /** 
   * Get the grid api options 
   * 
   * @param {Object} gridReadyEvent An object containing access to the grid APIs   
   */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    this.columnApi = gridReadyEvent.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  /** Makes the API call to load the devices */
  loadDevices() {
    Rx.Observable.fromPromise(iotHubManagerService.getDevices())
      .map(data => data.items)
      .subscribe(devices => this.setState({ devices: devices }));
  }

  /** When a new row is selected, update the selected devices state */
  onSelectionChanged = () => {
    this.setState({ selectedDevices: this.gridApi.getSelectedRows() }, () => {
      this.props.actions.devicesSelectionChanged(this.state.selectedDevices);
    });
  };

  /** Given a device object, extract and return the Id */
  getSoftSelectId = ({ Id }) => Id;

  /** When a row is selected, open the flyout for that devices details */
  onRowClicked = ({ data }) => {
    this.setState({ softSelectedDeviceId: this.getSoftSelectId(data) });
    this.props.actions.showFlyout({ device: data, type: 'Device detail' });
  };

  render() {
    return (
      <PcsGrid
        /* Grid Properties */
        multiSelect={true}
        rowSelection={'multiple'}
        columnDefs={this.state.columnHeaders}
        rowData={this.state.devices}
        enableColResize={true}
        pagination={true}
        paginationAutoPageSize={true}
        suppressCellSelection={true}
        suppressRowClickSelection={true} // Suppress so that a row is only selectable by checking the checkbox
        suppressClickEdit={false}
        softSelectId={this.state.softSelectedDeviceId}
        /* Grid Events */
        onGridReady={this.onGridReady}
        onSelectionChanged={this.onSelectionChanged}
        onRowClicked={this.onRowClicked}
        getSoftSelectId={this.getSoftSelectId}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(null, mapDispatchToProps)(DevicesGrid);
