// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../../common/lang';
import Rx from 'rxjs';
import * as actions from '../../actions';
import moment from 'moment';
import PcsGrid from '../pcsGrid/pcsGrid';
import IotHubManagerService from '../../services/iotHubManagerService';
import './systemStatusGrid.css';

const EMPTY_FIELD = '---';

class SystemStatusGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnHeaders: [
        {
          headerName: lang.JOBNAME,
          field: 'jobId',
        },
        {
          headerName: lang.STATUS,
          field: 'status',
          valueFormatter: ({ value }) => {
            switch(value) {
                case 1: return lang.ENQUEUED;
                case 2: return lang.RUNNING;
                case 3: return lang.COMPLETED;
                case 4: return lang.FAILED;
                case 5: return lang.CANCELLED;
                case 6: return lang.SCHEDULED;
                default: return lang.QUEUED;
            }
          }
        },
        {
          headerName: lang.OPERATION,
          field: 'type',
          valueFormatter: ({ value, data }) => {
            if (value === 3) { return data.methodParameter && data.methodParameter.name; }
            else if (value === 4) {
              if (data.updateTwin && data.updateTwin.tags && Object.keys(data.updateTwin.tags).length) {
                return lang.TAG;
              } else {
                return lang.RECONFIGURE;
              }
            }
            return '';
          }
        },
        {
          headerName: lang.NO_OF_DEVICES,
          field: 'resultStatistics.deviceCount',
          valueFormatter: ({ value }) => value || 0
        },
        {
          headerName: lang.SUCCEEDED_CAPITAL,
          field: 'resultStatistics.succeededCount',
          valueFormatter: ({ value }) => value || 0
        },
        {
          headerName: lang.FAILED_CAPITAL,
          field: 'resultStatistics.failedCount',
          valueFormatter: ({ value }) => value || 0
        },
        {
          headerName: lang.START_TIME,
          field: 'createdTimeUtc',
          valueFormatter: ({ value }) => {
            const time = moment(value);
            return (time.unix() < 0) ? EMPTY_FIELD : time.format("hh:mm:ss MM.DD.YYYY");
           }
          },
          {
            // TODO: Replace when service provides the endTime
            headerName: lang.END_TIME,
            field: 'endTimeUtc',
            valueFormatter: ({ value }) => {
              return EMPTY_FIELD;
          }
        }
      ],
      jobs: [],
      selectedJobs: [],
      softSelectedJobId: ''
    };
    this.onGridReady = this.onGridReady.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.getSoftSelectId = this.getSoftSelectId.bind(this)

  }

  /** Initialize the Jobs when the component loads */
  componentDidMount() {
    this.loadAllJobs();
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

  /** Makes the API call to load the jobs */
  loadAllJobs() {
    Rx.Observable.fromPromise(IotHubManagerService.getAllJobs())
      .subscribe(jobs => this.setState({ jobs }));
  }

  /** When a new row is selected, update the selected jobs state */
  onSelectionChanged() {
    this.setState({ selectedJobs: this.gridApi.getSelectedRows() }, () => {
      this.props.actions.JobSelectionChanged(this.state.selectedJobs);
    });
  };

  /** Given a job object, extract and return the jobId */
  getSoftSelectId({ jobId })  {
    return jobId;
  }

  render() {
    const { jobs } = this.state;
    return (
      <div className="system-status-container">
        {jobs && jobs.length ?
        <PcsGrid
          /* Grid Properties */
          multiSelect={true}
          rowSelection={'multiple'}
          columnDefs={this.state.columnHeaders}
          rowData={this.state.jobs}
          enableColResize={true}
          pagination={true}
          paginationPageSize={8}
          suppressCellSelection={true}
          suppressRowClickSelection={true} // Suppress so that a row is only selectable by checking the checkbox
          suppressClickEdit={false}
          softSelectId={this.state.softSelectedJobId}
          /* Grid Events */
          onGridReady={this.onGridReady}
          onSelectionChanged={this.onSelectionChanged}
          getSoftSelectId={this.getSoftSelectId}
        /> : null }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(null, mapDispatchToProps)(SystemStatusGrid);
