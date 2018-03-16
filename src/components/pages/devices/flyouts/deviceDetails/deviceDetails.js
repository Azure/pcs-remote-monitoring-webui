// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { TelemetryService } from 'services';
import { DeviceIcon } from './deviceIcon';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import { translateColumnDefs } from 'utilities';
import {
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent
} from 'components/shared';
import {
  PropertyGrid as Grid,
  PropertyRow as Row,
  PropertyHeaderCell as HeaderCell,
  PropertyCell as Cell
} from './propertyGrid';
import { Accordion } from './accordion';

import './deviceDetails.css';

export class DeviceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarms: undefined,
      isAlarmsPending: false,
      alarmsError: undefined
    };
    this.columnDefs = [
      rulesColumnDefs.ruleName,
      rulesColumnDefs.severity,
      rulesColumnDefs.explore
    ];
  }

  componentDidMount() {
    if (!this.props.rulesLastUpdated) this.props.fetchRules();
    this.fetchAlarms((this.props.device || {}).id);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.device || {}).id !== nextProps.device.id) {
      this.fetchAlarms((nextProps.device || {}).id);
    }
  }

  componentWillUnmount() {
    this.alarmSubscription.unsubscribe();
  }

  applyRuleNames = (alarms, rules) =>
    alarms.map(alarm => ({
      ...alarm,
      name: (rules[alarm.ruleId] || {}).name
    }));

  fetchAlarms = (deviceId) => {
    this.setState({ isAlarmsPending: true });

    this.alarmSubscription = TelemetryService.getAlarms({
      limit: 5,
      order: "desc",
      devices: deviceId
    })
      .subscribe(
      alarms => this.setState({ alarms, isAlarmsPending: false, alarmsError: undefined }),
      alarmsError => this.setState({ alarmsError, isAlarmsPending: false })
      );
  }

  render() {
    const { t, onClose, device } = this.props;
    const isPending = this.state.isAlarmsPending && this.props.isRulesPending;
    const rulesGridProps = {
      rowData: isPending ? undefined : this.applyRuleNames(this.state.alarms || [], this.props.rules || []),
      t: this.props.t,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs)
    };
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.details.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          {
            !device &&
            <div className="device-details-container">{t("devices.details.noDevice")}</div>
          }
          {
            !!device &&
            <div className="device-details-container">

              <Grid className="device-details-header">
                <Row>
                  <Cell className="col-3"><DeviceIcon type={device.type} /></Cell>
                  <Cell className="col-7">
                    <div className="device-name">{device.id}</div>
                    <div className="device-simulated">{device.isSimulated ? t('devices.details.simulated') : t('devices.details.notSimulated')}</div>
                    <div className="device-connected">{device.connected ? t('devices.details.connected') : t('devices.details.notConnected')}</div>
                  </Cell>
                </Row>
              </Grid>

              {(!this.state.isAlarmsPending && this.state.alarms && (this.state.alarms.length > 0)) && <RulesGrid {...rulesGridProps} />}

              <Accordion title={t('devices.details.telemetry.title')}>
                TODO: Add chart when able.
              </Accordion>

              <Accordion title={t('devices.details.tags.title')} description={t('devices.details.tags.description')}>
                <Grid>
                  {
                    (device.tags && device.tags.length) &&
                    <Row>
                      <HeaderCell className="col-3">{t('devices.details.tags.keyHeader')}</HeaderCell>
                      <HeaderCell className="col-7">{t('devices.details.tags.valueHeader')}</HeaderCell>
                    </Row>
                  }
                  {
                    (Object.entries(device.tags) || []).map(([tagName, tagValue], idx) =>
                      <Row key={idx}>
                        <Cell className="col-3">{tagName}</Cell>
                        <Cell className="col-7">{tagValue.toString()}</Cell>
                      </Row>
                    )
                  }
                </Grid>
              </Accordion>

              <Accordion title={t('devices.details.methods.title')} description={t('devices.details.methods.description')}>
                <Grid>
                  {
                    ((device.methods || '').split(',') || []).map((methodName, idx) =>
                      <Row key={idx}>
                        <Cell>{methodName}</Cell>
                      </Row>
                    )
                  }
                </Grid>
              </Accordion>

              <Accordion title={t('devices.details.properties.title')} description={t('devices.details.properties.description')}>
                <Grid>
                  {
                    (device.properties && device.properties.length) &&
                    <Row>
                      <HeaderCell className="col-3">{t('devices.details.properties.keyHeader')}</HeaderCell>
                      <HeaderCell className="col-7">{t('devices.details.properties.valueHeader')}</HeaderCell>
                    </Row>
                  }
                  {
                    (Object.entries(device.properties) || []).map(([propertyName, propertyValue], idx) =>
                      <Row key={idx}>
                        <Cell className="col-3">{propertyName}</Cell>
                        <Cell className="col-7">{propertyValue.toString()}</Cell>
                      </Row>
                    )
                  }
                </Grid>
              </Accordion>

              <Accordion title={t('devices.details.diagnostics.title')} description={t('devices.details.diagnostics.description')}>
                TODO: Add diagnostics.
              </Accordion>
            </div>
          }
        </FlyoutContent>
      </Flyout>
    );
  }
}
