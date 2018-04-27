// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';
import { Route, Redirect, Switch } from 'react-router-dom';
import moment from 'moment';

import { Summary } from './summary/summary';
import { RuleDetails } from './ruleDetails/ruleDetails';
import { JobDetails } from './jobDetails/jobDetails';
import { getIntervalParams } from 'utilities';

import { TelemetryService, IoTHubManagerService } from 'services';

import './maintenance.css';

export class Maintenance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timeInterval: 'PT1H',

      alertsIsPending: true,
      alerts: [],
      alertsError: undefined,
      alertCount: undefined,
      criticalAlertCount: undefined,
      warningAlertCount: undefined,

      jobsIsPending: true,
      jobs: [],
      jobsError: undefined,
      jobsCount: undefined,
      failedJobsCount: undefined,
      succeededJobsCount: undefined,

      lastUpdated: undefined
    };

    if (!this.props.rulesLastUpdated) {
      this.props.fetchRules();
    }

    this.subscriptions = [];
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const deviceIds = Object.keys(this.props.deviceEntities);
    const devices = deviceIds.length ? deviceIds.join(',') : undefined;
    const [ timeParams ] = getIntervalParams(this.state.timeInterval);
    const params = { ...timeParams, devices };
    this.setState({
      alertsIsPending: true,
      jobsIsPending: true,
      alertCount: undefined,
      alertsError: undefined,
      criticalAlertCount: undefined,
      warningAlertCount: undefined,
      jobsCount: undefined,
      failedJobsCount: undefined,
      succeededJobsCount: undefined,
      jobsError: undefined
    });
    this.clearSubscriptions();
    this.subscriptions.push(
      TelemetryService.getActiveAlerts(params)
        .flatMap(alerts => alerts)
        .flatMap(alert =>
          // Get the last occurrence of the alert and the counts per alert status
          TelemetryService.getAlertsForRule(alert.ruleId, { ...params, order: 'desc' })
            .flatMap(alerts =>
              Observable.from(alerts)
                .reduce(
                  (acc, { status }) => ({ ...acc, [status]: (acc[status] || 0) + 1 }),
                  {}
                )
                .map(countPerStatus => ({ alerts, lastOccurrence: (alerts[0] || {}).dateCreated, countPerStatus }))
            )
            .map(statsPerStatus => ({ ...alert, ...statsPerStatus }))
        )
        .toArray()
        .subscribe(
          alerts => {
            const { criticalAlertCount, warningAlertCount } = alerts.reduce(
              (acc, { severity, alerts }) => ({
                criticalAlertCount: acc.criticalAlertCount + (severity === 'critical' ? alerts.length : 0),
                warningAlertCount: acc.warningAlertCount + (severity === 'warning' ? alerts.length : 0)
              }),
              { criticalAlertCount: 0, warningAlertCount: 0 }
            );
            this.setState({
              alerts,
              alertsIsPending: false,
              lastUpdated: moment(),
              criticalAlertCount,
              warningAlertCount,
              alertCount: criticalAlertCount + warningAlertCount
            })
          },
          alertsError => this.setState({ alertsError, alertsIsPending: false })
        )
    );

    this.subscriptions.push(
      IoTHubManagerService.getJobs(params)
        .subscribe(
          jobs => {
            const { failedJobsCount, succeededJobsCount } = jobs.reduce(
              (acc, { stats = {} }) => ({
                failedJobsCount: acc.failedJobsCount + (stats.failedCount || 0),
                succeededJobsCount: acc.succeededJobsCount + (stats.succeededCount || 0)
              }),
              { failedJobsCount: 0, succeededJobsCount: 0 }
            );
            this.setState({
              jobs,
              jobsIsPending: false,
              lastUpdated: moment(),
              failedJobsCount,
              succeededJobsCount,
              jobsCount: failedJobsCount + succeededJobsCount
            })
          },
          jobsError => this.setState({ jobsError, jobsIsPending: false })
        )
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceLastUpdated !== this.props.deviceLastUpdated) {
      this.getData();
    }
  }

  componentWillUnmount() {
    this.clearSubscriptions();
  }

  clearSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  onTimeIntervalChange = (timeInterval) => this.setState({ timeInterval }, () => this.getData());

  render() {
    const { rulesEntities, deviceEntities, rulesIsPending, theme, t, history } = this.props;
    const {
      alerts,
      alertCount,
      criticalAlertCount,
      warningAlertCount,
      alertsIsPending,
      alertsError,

      jobs,
      jobsIsPending,
      jobsError,
      failedJobsCount,
      succeededJobsCount,
      jobsCount
    } = this.state;

    // Add the rule name to the rules data by merging from the redux store
    const alertsWithRulename = alerts.map((alert) => ({
      ...alert,
      name: (rulesEntities[alert.ruleId] || {}).name,
      counts: {
        open: alert.countPerStatus.open || 0,
        closed: alert.countPerStatus.closed || 0,
        acknowledged: alert.countPerStatus.acknowledged || 0,
        total: alert.alerts.length
      }
    }));

    const generalProps = {
      t,
      history,
      refreshData: this.getData,
      lastUpdated: this.state.lastUpdated
    };
    const alertProps = {
      isPending: rulesIsPending || alertsIsPending,
      error: alertsError,
      alerts: alertsWithRulename
    };
    const jobProps = {
      isPending: jobsIsPending,
      jobs,
      error: jobsError
    };

    return (
      <Switch>
        <Route exact path={'/maintenance/:path(notifications|jobs)'}
          render={() =>
            <Summary
            {...generalProps}

            onTimeIntervalChange={this.onTimeIntervalChange}
            timeInterval={this.state.timeInterval}

            criticalAlertCount={criticalAlertCount}
            warningAlertCount={warningAlertCount}
            alertCount={alertCount}

            failedJobsCount={failedJobsCount}
            succeededJobsCount={succeededJobsCount}
            jobsCount={jobsCount}

            alertProps={alertProps}
            jobProps={jobProps} />
          } />
        <Route exact path={'/maintenance/rule/:id'}
          render={(routeProps) =>
            <RuleDetails
              {...generalProps}
              {...alertProps}
              {...routeProps}
              theme={theme}
              rulesEntities={rulesEntities}
              deviceEntities={deviceEntities} />
          } />
        <Route exact path={'/maintenance/job/:id'}
          render={(routeProps) =>
            <JobDetails
              {...generalProps}
              {...jobProps}
              {...routeProps}
              deviceEntities={deviceEntities} />
          }  />
        <Redirect to="/maintenance/notifications" />
      </Switch>
    );
  }

};
