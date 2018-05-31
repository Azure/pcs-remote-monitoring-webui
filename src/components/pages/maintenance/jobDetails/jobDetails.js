// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import Config from 'app.config';
import { AjaxError, PageContent, ContextMenu, RefreshBar } from 'components/shared';
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
      jobStatusError: undefined,
      contextBtns: undefined,
      refreshPending: undefined
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
    // TODO: Need to reset selectedJob when the job ID changes or when the user clicked refresh (i.e. refreshPending = true).
    //       A long term fix would be to normalize the job data in maintenance.js (similar to how Telemetry is handled there).
    //       When/if that happens, remove all use of refreshPending in the local state of this component.
    if ((nextProps.match.params.id !== (this.state.selectedJob || {}).jobId || this.state.refreshPending) && nextProps.jobs.length) {
      const selectedJob = nextProps.jobs.filter(({ jobId }) => jobId === nextProps.match.params.id)[0];
      this.setState({ selectedJob, refreshPending: false }, () => this.refreshJobStatus());
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
    this.setState({refreshPending: true});
    this.props.refreshData();
    // TODO: When refreshPending is removed in favor of normalizing the job data, the next line may be needed.
    // this.refreshJobStatus();
  }

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    const selectedJob = this.state.selectedJob;
    const jobGridProps = {
      domLayout: 'autoHeight',
      rowData: this.props.isPending ? undefined : selectedJob ? [selectedJob] : [],
      pagination: false,
      t: this.props.t
    };

    const jobStatusGridProps = {
      domLayout: 'autoHeight',
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
        {this.state.contextBtns}
        <RefreshBar
          refresh={this.refreshData}
          time={this.props.lastUpdated}
          isPending={this.props.isPending}
          t={this.props.t} />
      </ContextMenu>,
      <PageContent className="maintenance-container" key="page-content">
        <h1 className="maintenance-header">{selectedJob ? selectedJob.jobId : ""}</h1>
        {
          !this.props.error
            ? <div>
                <JobGrid {...jobGridProps} />
                <JobStatusGrid {...jobStatusGridProps} />
                <h4 className="maintenance-sub-header">{this.props.t('maintenance.devices')}</h4>
                {
                  this.state.selectedDevices
                    ? <DevicesGrid
                        t={this.props.t}
                        domLayout={'autoHeight'}
                        rowData={this.state.selectedDevices}
                        onContextMenuChange={this.onContextMenuChange} />
                    : this.props.t('maintenance.noOccurrenceSelected')
                }
            </div>
            : <AjaxError t={this.props.t} error={this.props.error} />
        }
      </PageContent>
    ];
  }
}
