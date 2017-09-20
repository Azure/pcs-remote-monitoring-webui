// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Lang from '../../common/lang';
import DevicesGrid from '../devicesGrid/devicesGrid';
import PcsGrid from '../pcsGrid/pcsGrid';
import { systemStatusColumnDefs, systemStatusGridProps } from '../systemStatusGrid/systemStatusConfig';
import './systemStatusDetailsGrid.css';

class SystemStatusDetailsGrid extends Component {
  constructor(props) {
    super(props);

    this.defaultColumnDefs = [
      systemStatusColumnDefs.jobId,
      systemStatusColumnDefs.status, // Status of total jobs ( fail/ Queued/completed)
      systemStatusColumnDefs.type, // MethodName of the total jobs
      systemStatusColumnDefs.deviceCount, // No of devices effected in the job.
      systemStatusColumnDefs.succeededCount, // Success count of the job based on the devices
      systemStatusColumnDefs.failedCount, // Failed count of the job
      systemStatusColumnDefs.startTime, // Start Time of the job
      systemStatusColumnDefs.endTime // End time of the job
    ];

    this.onGridReady = this.onGridReady.bind(this);
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
    const props = this.props;
    const deviceJobs = props.detailsDevices, jobs = props.detailsJobs, devices = props.systemStatusGridSelectedDevices;
    let devicesGridProps = {};
    if (devices && devices.length) {
      devicesGridProps.rowData = devices;
    }
    const jobIdTrim = jobs[0].jobId.substring(0, 20);
    return (
      <div className="system-details-container">
        {jobs && jobs.length ? <div className="sytem-status-header"> { jobIdTrim } </div> : null}
        {jobs && jobs.length
          ? <PcsGrid
              /* systemStatusGridProps Properties */
              {...systemStatusGridProps} // Default systemStatusGrid options
              columnDefs={this.defaultColumnDefs}
              pagination = {false}
              rowData={jobs}
            />: null}
        {deviceJobs && deviceJobs.length
          ?<PcsGrid
              /* systemStatusGridProps Properties */
              {...systemStatusGridProps} // Default systemStatusGrid options
              columnDefs={this.props.systemStatusGridColumnDefs}
              rowData={deviceJobs}
              /* Grid Events */
              onSoftSelectChange={this.props.onDeviceJobSoftSelectChange}
              onGridReady={this.onGridReady}
            /> : null}
        <div className="devices-container">
          <div className="devices-header"> {Lang.DEVICES} </div>
          <div className="devices-placeholder">
            {devices && devices.length ? <DevicesGrid {...devicesGridProps} pagination = {false} />
              : <div className="no-devices-text">
                  {Lang.NO_OCCURENCES}
                </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default (SystemStatusDetailsGrid);
