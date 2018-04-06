// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { TelemetryService } from 'services';
import { DeviceIcon } from './deviceIcon';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import { translateColumnDefs } from 'utilities';
import {
  ErrorMsg,
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
      rulesColumnDefs.alarmStatus,
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
    const tags = Object.entries(device.tags || {});
    const methods = device.methods ? device.methods.split(',') : [];
    const properties = Object.entries(device.properties || {});
    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('devices.flyouts.details.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          {
            !device &&
            <div className="device-details-container">
              <ErrorMsg>{t("devices.flyouts.details.noDevice")}</ErrorMsg>
            </div>
          }
          {
            !!device &&
            <div className="device-details-container">

              <Grid className="device-details-header">
                <Row>
                  <Cell className="col-3"><DeviceIcon type={device.type} /></Cell>
                  <Cell className="col-7">
                    <div className="device-name">{device.id}</div>
                    <div className="device-simulated">{device.isSimulated ? t('devices.flyouts.details.simulated') : t('devices.flyouts.details.notSimulated')}</div>
                    <div className="device-connected">{device.connected ? t('devices.flyouts.details.connected') : t('devices.flyouts.details.notConnected')}</div>
                  </Cell>
                </Row>
              </Grid>

              {(!this.state.isAlarmsPending && this.state.alarms && (this.state.alarms.length > 0)) && <RulesGrid {...rulesGridProps} />}

              <Accordion title={t('devices.flyouts.details.telemetry.title')}>
                TODO: Add chart when able.
              </Accordion>

              <Accordion title={t('devices.flyouts.details.tags.title')} description={t('devices.flyouts.details.tags.description')}>
                {
                  (tags.length === 0) &&
                  t('devices.flyouts.details.tags.noneExist')
                }
                {
                  (tags.length > 0) &&
                  <Grid>
                    <Row>
                      <HeaderCell className="col-3">{t('devices.flyouts.details.tags.keyHeader')}</HeaderCell>
                      <HeaderCell className="col-7">{t('devices.flyouts.details.tags.valueHeader')}</HeaderCell>
                    </Row>
                    {
                      tags.map(([tagName, tagValue], idx) =>
                        <Row key={idx}>
                          <Cell className="col-3">{tagName}</Cell>
                          <Cell className="col-7">{tagValue.toString()}</Cell>
                        </Row>
                      )
                    }
                  </Grid>
                }
              </Accordion>

              <Accordion title={t('devices.flyouts.details.methods.title')} description={t('devices.flyouts.details.methods.description')}>
                {
                  (methods.length === 0)
                    ? t('devices.flyouts.details.methods.noneExist')
                    :
                    <Grid>
                      {
                        methods.map((methodName, idx) =>
                          <Row key={idx}>
                            <Cell>{methodName}</Cell>
                          </Row>
                        )
                      }
                    </Grid>
                }
              </Accordion>

              <Accordion title={t('devices.flyouts.details.properties.title')} description={t('devices.flyouts.details.properties.description')}>
                {
                  (properties.length === 0) &&
                  t('devices.flyouts.details.properties.noneExist')
                }
                {
                  (properties.length > 0) &&
                  <Grid>

                    <Row>
                      <HeaderCell className="col-3">{t('devices.flyouts.details.properties.keyHeader')}</HeaderCell>
                      <HeaderCell className="col-7">{t('devices.flyouts.details.properties.valueHeader')}</HeaderCell>
                    </Row>
                    {
                      properties.map(([propertyName, propertyValue], idx) =>
                        <Row key={idx}>
                          <Cell className="col-3">{propertyName}</Cell>
                          <Cell className="col-7">{propertyValue.toString().replace(/,/g, ", ")}</Cell>
                        </Row>
                      )
                    }
                  </Grid>
                }
              </Accordion>

              <Accordion title={t('devices.flyouts.details.diagnostics.title')} description={t('devices.flyouts.details.diagnostics.description')}>
                TODO: Add diagnostics.
              </Accordion>
            </div>
          }
        </FlyoutContent>
      </Flyout>
    );
  }
}
