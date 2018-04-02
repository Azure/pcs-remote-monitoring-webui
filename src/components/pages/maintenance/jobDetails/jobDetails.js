// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import Config from 'app.config';
import { PageContent, ContextMenu, RefreshBar } from 'components/shared';
import { DevicesGrid } from 'components/pages/devices/devicesGrid';
import { JobGrid, JobStatusGrid } from 'components/pages/maintenance/grids';

import { IoTHubManagerService } from 'services';

export class JobDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedJob: undefined,
      selectedDevices: undefined,
      jobStatusIsPending: true,
      jobStatus: undefined,
      jobStatusError: undefined
    };
  }

  componentDidMount() {
    this.handleNewProps(this.props);
    this.clearSubscription();
  }

  componentWillReceiveProps(nextProps) {
    this.handleNewProps(nextProps);
  }

  handleNewProps(nextProps) {
    if (nextProps.match.params.id !== (this.state.selectedJob || {}).jobId && nextProps.jobs.length) {
      const selectedJob = nextProps.jobs.filter(({ jobId }) => jobId === nextProps.match.params.id)[0];
      this.setState({ selectedJob }, () => this.refreshJobStatus());
    }
  }

  getJobStatus(jobId) {
    this.clearSubscription();
    this.setState({ jobStatusIsPending: true });
    this.subscription = IoTHubManagerService.getJobStatus(jobId)
      .subscribe(
        jobStatus => this.setState({ jobStatus, jobStatusIsPending: false }),
        jobStatusError => this.setState({ jobStatusError, jobStatusIsPending: false }),
      );
  }

  refreshJobStatus = () => {
    if (this.state.selectedJob && this.state.selectedJob.jobId) {
      this.getJobStatus(this.state.selectedJob.jobId);
    }
  }

  clearSubscription() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  refreshData = () => {
    this.props.refreshData();
    this.refreshJobStatus();
  }

  render() {
    const selectedJob = this.state.selectedJob;
    const jobGridProps = {
      rowData: this.props.isPending ? undefined : selectedJob ? [selectedJob] : [],
      pagination: false,
      t: this.props.t
    };

    const jobStatusGridProps = {
      rowData: this.state.jobStatusIsPending ? undefined : [this.state.jobStatus],
      pagination: true,
      paginationPageSize: Config.smallGridPageSize,
      onRowClicked: ({ data: { devices } }) => this.setState({
        selectedDevices: devices.map(({ deviceId }) => this.props.deviceEntities[deviceId])
      }),
      t: this.props.t
    };

    return [
      <ContextMenu key="context-menu">
        <RefreshBar
          refresh={this.refreshData}
          time={this.props.lastUpdated}
          isPending={this.props.isPending}
          t={this.props.t} />
      </ContextMenu>,
      <PageContent className="maintenance-container" key="page-content">
        <JobGrid {...jobGridProps} />
        <JobStatusGrid {...jobStatusGridProps} />
        <h4 className="sub-heading">Devices</h4>
        {
          this.state.selectedDevices
            ? <DevicesGrid rowData={this.state.selectedDevices} t={this.props.t} />
            : 'No occurences selected'
        }
      </PageContent>
    ];
  }

}
