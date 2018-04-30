// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import moment from 'moment';

import Config from 'app.config';
import { Summary } from './summary/summary';
import { RuleDetails } from './ruleDetails/ruleDetails';
import { JobDetails } from './jobDetails/jobDetails';
import { getIntervalParams } from 'utilities';

import { TelemetryService, IoTHubManagerService } from 'services';

import './maintenance.css';

const alertSchema = new schema.Entity('alerts');
const alertListSchema = new schema.Array(alertSchema);

// TODO: Refactor some of the naming in this file related to rules, alert, and alerts
export class Maintenance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timeInterval: 'PT1H',

      alertsIsPending: true,
      alertEntities: {},
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
            .map(alerts => ({
              ...alert,
              alerts,
              lastOccurrence: (alerts[0] || {}).dateCreated
            }))
        )
        .toArray()
        .subscribe(
          alertedRules => {
            const { criticalAlertCount, warningAlertCount, alertEntities } = alertedRules.reduce(
              (acc, alertedRule) => {
                const { entities: { alerts }, result } = normalize(alertedRule.alerts, alertListSchema);
                alertedRule.alerts = result;
                return update(acc, {
                  criticalAlertCount: {
                    $set: acc.criticalAlertCount + (alertedRule.severity === Config.ruleSeverity.critical ? alertedRule.alerts.length : 0)
                  },
                  warningAlertCount: {
                    $set: acc.warningAlertCount + (alertedRule.severity === Config.ruleSeverity.warning ? alertedRule.alerts.length : 0)
                  },
                  alertEntities: { $merge: alerts }
                });
              },
              {
                criticalAlertCount: 0,
                warningAlertCount: 0,
                alertEntities: {}
              }
            );
            this.setState({
              alerts: alertedRules,
              alertEntities,
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

  setAlertStatus = (alerts, newStatus) => {
    // Create the object to update the component state
    const updates = alerts.reduce((acc, { id }) => update(acc, {
      [id]: { $set:
        { status: { $set: newStatus } }
      }
    }), {});
    this.setState(update(this.state, {
      alertEntities: updates
    }));
  };

  onTimeIntervalChange = (timeInterval) => this.setState({ timeInterval }, () => this.getData());

  render() {
    const { rulesEntities, deviceEntities, rulesIsPending, theme, t, history } = this.props;
    const {
      alerts,
      alertEntities,
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
    const alertsWithRulename = alerts.map((alert) => {
      const countPerStatus = alert.alerts.reduce(
        (acc, id) => {
          const { status } = alertEntities[id];
          return { ...acc, [status]: (acc[status] || 0) + 1 }
        },
        {}
      );
      return {
        ...alert,
        name: (rulesEntities[alert.ruleId] || {}).name,
        counts: {
          open: countPerStatus.open || 0,
          closed: countPerStatus.closed || 0,
          acknowledged: countPerStatus.acknowledged || 0,
          total: alert.alerts.length
        }
      };
    });

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
              setAlertStatus={this.setAlertStatus}
              alertEntities={alertEntities}
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
