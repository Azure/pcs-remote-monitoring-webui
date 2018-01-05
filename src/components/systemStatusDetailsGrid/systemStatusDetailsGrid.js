// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Rx from 'rxjs';
import { isEqual } from 'lodash';

import * as actions from "../../actions";
import Lang from '../../common/lang';
import DevicesGrid from '../devicesGrid/devicesGrid';
import PcsGrid from '../pcsGrid/pcsGrid';
import { systemStatusColumnDefs, systemStatusGridProps } from '../systemStatusGrid/systemStatusConfig';
import ApiService from '../../common/apiService';

import './systemStatusDetailsGrid.css';

const jobDoneSet = new Set([3, 4, 5]);

class SystemStatusDetailsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.defaultColumnDefs = [
      systemStatusColumnDefs.jobId,
      systemStatusColumnDefs.status, // Status of total jobs ( fail/ Queued/completed)
      systemStatusColumnDefs.type, // MethodName of the total jobs
      systemStatusColumnDefs.deviceCount, // No of devices affected in the job.
      systemStatusColumnDefs.succeededCount, // Success count of the job based on the devices
      systemStatusColumnDefs.failedCount, // Failed count of the job
      systemStatusColumnDefs.startTime, // Start Time of the job
      systemStatusColumnDefs.endTime // End time of the job
    ];

    this.systemStatusGridColumnDefs = [
      systemStatusColumnDefs.jobId,
      systemStatusColumnDefs.deviceIdAffected,
      systemStatusColumnDefs.status,
      systemStatusColumnDefs.lastReturnMessage,
      systemStatusColumnDefs.startTime,
      systemStatusColumnDefs.endTime
    ];

    this.onGridReady = this.onGridReady.bind(this);
    this.onSoftSelectDeviceGrid = this.onSoftSelectDeviceGrid.bind(this);
    // A stream of job ids
    this.refreshStream = new Rx.Subject();
  }

  onSoftSelectDeviceGrid(device) {
    this.setState({ softSelectedDeviceId: device.Id });
    this.props.btnActions.onSoftSelectDeviceGrid(device);
  }

  componentDidMount() {
    this.subscription = this.refreshStream
      .filter(job => job && job.jobId) // Filter out undefined
      .debounceTime(5000)
      .flatMap(({ jobId }) => ApiService.getJobStatus(jobId))
      .filter(job => {
        const isComplete = jobDoneSet.has(job.status);
        if (!isComplete) this.refreshStream.next(job);
        return isComplete;
      })
      .subscribe(
        job => {
          this.props.actions.updateJobs(job);
          this.props.actions.loadDevices(true);
        },
        err => console.error(err)
      );

    // Initial refresh
    this.refreshStream.next(this.props.jobDetails);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.jobDetails, this.props.jobDetails)) {
      this.refreshStream.next(nextProps.jobDetails);
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady(gridReadyEvent) {
    this.gridApi = gridReadyEvent.api;
    this.columnApi = gridReadyEvent.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const { detailsDevices, jobDetails, systemStatusGridSelectedDevices, btnActions, devices } = this.props;
    const hasJobs = (detailsDevices || []).length > 0;
    const deviceIds = new Set(detailsDevices.map(({ deviceId }) => deviceId));
    const devicesGridProps = {
      rowData: devices.filter(({ Id }) => deviceIds.has(Id)),
      onSoftSelectChange: this.onSoftSelectDeviceGrid,
      onContextMenuChange: btnActions.onContextMenuChange,
      softSelectId: this.state.softSelectedDeviceId,
      getSoftSelectId: btnActions.getSoftSelectId
    };
    const jobIdTrim = ((jobDetails || {}).jobId || '').substring(0, 20);
    return (
      <div className="system-details-container">
        <div className="sytem-status-header"> { jobIdTrim } </div>
        <PcsGrid
          /* systemStatusGridProps Properties */
          {...systemStatusGridProps} // Default systemStatusGrid options
          columnDefs={this.defaultColumnDefs}
          pagination = {false}
          rowData={hasJobs ? [jobDetails] : undefined}
        />

        <PcsGrid
          /* systemStatusGridProps Properties */
          {...systemStatusGridProps} // Default systemStatusGrid options
          columnDefs={this.systemStatusGridColumnDefs}
          rowData={hasJobs ? detailsDevices : undefined}
          /* Grid Events */
          onSoftSelectChange={this.props.onDeviceJobSoftSelectChange}
          onGridReady={this.onGridReady}
        />

        { hasJobs &&
            <div className="devices-container">
              <div className="devices-header"> {Lang.DEVICES} </div>
              <div className="devices-placeholder">
                {systemStatusGridSelectedDevices && systemStatusGridSelectedDevices.length
                  ? <DevicesGrid {...devicesGridProps} pagination = {false} />
                  : <div className="no-devices-text">
                      {Lang.NO_OCCURENCES}
                    </div>}
              </div>
            </div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

const mapStateToProps = state => {
  return {
    devices: (state.deviceReducer.devices || {}).Items || []
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusDetailsGrid);
